import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const secretkey=process.env.SECRET_KEY;
export async function POST(req,res){
    try{
        const {users}=await connectDB();
        const payload=await req.json();
        if(payload.email[0]=='@') payload.email=payload.email.slice(1);
        const userdata = await users.findOne({
            $or: [{ email: payload.email }, { username: payload.email }],
          });
        if(!userdata){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        const compare=await bcrypt.compare(payload.password,userdata.password);
        if(compare){
            const jwtpayload={
                userId:userdata._id.toString(),
                name:payload.username,
            }
            const token=jwt.sign(jwtpayload,secretkey,{expiresIn:"1h"});
            return NextResponse.json({message:"Success",logintoken:token},{status:200});
        }
        return NextResponse.json({error:"invalid credentials"},{status:401});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}