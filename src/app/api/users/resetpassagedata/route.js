import { NextResponse } from "next/server";
import connectDB from "@/app/database/db";
import Middleware from "@/app/api/passage/middleware";
const bcrypt=require("bcryptjs");
export async function DELETE(req,res){
    try{
        // connecting to db
        const {users,passage}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        let response= await Middleware(req,payload.username,users)
        if(response.status!=200){
            return NextResponse.json({error:"Invalid Token",status:401});
        }
        
        // finding user
        const username=await users.findOne({username:payload.username});
        if(!username){
            return NextResponse.json({error:"User not found",status:404});
        }

        // if user found then verify the password
        const compare=await bcrypt.compare(payload.password,username.password);
        if(compare){
            //make user passagelist and datwise empty and also make maxwpm,maxaccuracy,totalattempts,totalpassages= 0
            await users.updateOne({username:payload.username},{$set:{passagelist:{},datewise:{},maxwpm:0,maxaccuracy:0,totalattempts:0,totalpassages:0}});

            // search in passage collection and delete from usernames  // Add more usernames as needed

            const deletePassage=await passage.updateMany({
                [`usernames.${payload.username}`]: {
                    $exists: true,
                    $not: { $eq: {} }
                }
            },{
                $unset:{
                    [`usernames.${payload.username}`]:""
                }
            });

            // remove from winner
            const deleteWinner=await passage.updateMany({
                "winner.username":payload.username
            },{
                $set:{
                    "winner":{
                        name:"",
                        username:"",
                        maxwpm:0,
                        maxaccuracy:0
                    }
                }
            });
            
        
            return NextResponse.json({message:"Successfully deleted",status:200});
        }

        // if password does not match
        return NextResponse.json({error:"invalid credentials",status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}