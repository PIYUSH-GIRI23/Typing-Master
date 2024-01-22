import { NextResponse } from "next/server";
import connectDB from "@/app/database/db";
const bcrypt=require("bcryptjs");
export async function DELETE(req,res){
    try{
        // connecting to db
        const {users}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        // finding user
        const useremail=await users.findOne({email:payload.email});
        if(!useremail){
            return NextResponse.json({error:"User not found"},{status:404});
        }

        // if user found then verify the password
        const compare=await bcrypt.compare(payload.password,useremail.password);
        if(compare){
            // if password matches then delete the user
            await users.deleteOne({email:payload.email});
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
        const {users}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        // finding user
        const useremail=await users.findOne({email:payload.email});
        // if user not found
        if(!useremail){
            return NextResponse.json({error:"User not found"},{status:404});
        }

        // removing @ from starting of username
        if(payload.username[0]=='@') payload.username=payload.username.slice(1);

        // if user found then verify the password
        const compare=await bcrypt.compare(payload.password,useremail.password);
        if(compare){
            // if password matches then update the user
            const updateQuery = {
                $set: {
                  username: payload.username,
                  password: await bcrypt.hash(payload.newpassword, 10), // encrypting new password
                },
            };
            // updating user
            await users.updateOne({ email: payload.email }, updateQuery);
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