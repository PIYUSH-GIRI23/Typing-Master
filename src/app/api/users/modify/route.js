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
            return NextResponse.json({error:"User not found"},{status:404});
        }

        // if user found then verify the password
        const compare=await bcrypt.compare(payload.password,username.password);
        if(compare){

                // Delete the specific entry from usernames.${payload.username} if it exists
        const deletePassage = await passage.updateMany({
            [`usernames.${payload.username}`]: {
                $exists: true,
                $not: { $eq: {} }
            }},
            {
            $unset: {
                [`usernames.${payload.username}`]: ""
            }
            }
        );
        const deletePassage2 = await passage.deleteMany({
            ["usernames"]: {
                $exists: true,
                $eq:{}
            }});

            // if password matches then delete the user
            // await users.deleteOne({username:payload.username});
            return NextResponse.json({message:"Successfully deleted"},{status:200});
        }

        // if password does not match
        return NextResponse.json({error:"invalid credentials"},{status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}
export async function PUT(req,res){
    try{
        // connecting to db
        const {users,passage}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        // let response= await Middleware(req,payload.username,users)
        // if(response.status!=200){
        //     return NextResponse.json({error:"Invalid Token",status:401});
        // }

        // finding user
        const username=await users.findOne({username:payload.username});
        // if user not found
        if(!username){
            return NextResponse.json({error:"User not found"},{status:404});
        }


        // if user found then verify the password
        const compare=await bcrypt.compare(payload.password,username.password);
        if(compare){
            // if password matches then update the user
            const updateQuery = {
                $set: {
                  username: (payload.newusername!=payload.username)?payload.newusername:payload.username,
                  password: await bcrypt.hash(payload.newpassword, 10), // encrypting new password
                },
            };
            // updating user
            await users.updateOne({ username:payload.username }, updateQuery);

            // now change in passage collection
            if(payload.newusername!=payload.username){
                // change in usernames
                const updatePassage=await passage.updateMany({
                    [`usernames.${payload.username}`]: {
                        $exists: true,
                        $not: { $eq: {} }
                    }
                },{
                    $set:{
                        [`usernames.${payload.username}`]:payload.newusername
                    }
                });
                // change in winner
                const updateWinner=await passage.updateMany({
                    "winner.username":payload.username
                },{
                    $set:{
                        "winner.username":payload.newusername
                    }
                });
            }
            return NextResponse.json({message:"Successfully Updated"},{status:200});
        }

        // if password does not match
        return NextResponse.json({error:"invalid credentials"},{status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}