import { NextResponse } from "next/server";
import connectDB from "@/app/database/db";
const bcrypt=require("bcryptjs");
export async function DELETE(req,res){
    try{
        const {users}=await connectDB();
        const payload=await req.json();
        const useremail=await users.findOne({email:payload.email});
        if(!useremail){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        const compare=await bcrypt.compare(payload.password,useremail.password);
        if(compare){
            await users.deleteOne({email:payload.email});
            return NextResponse.json({message:"Successfully deleted"},{status:200});
        }
        return NextResponse.json({error:"invalid credentials"},{status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}
export async function PUT(req,res){
    try{
        const {users}=await connectDB();
        const payload=await req.json();
        const useremail=await users.findOne({email:payload.email});
        if(!useremail){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        if(payload.username[0]=='@') payload.username=payload.username.slice(1);
        const compare=await bcrypt.compare(payload.password,useremail.password);
        if(compare){
            const updateQuery = {
                $set: {
                  username: payload.username,
                  password: await bcrypt.hash(payload.newpassword, 10), 
                },
            };
            await users.updateOne({ email: payload.email }, updateQuery);
            return NextResponse.json({message:"Successfully Updated"},{status:200});
        }
        return NextResponse.json({error:"invalid credentials"},{status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}