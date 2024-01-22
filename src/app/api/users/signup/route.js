import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const secretkey=process.env.SECRET_KEY;
export async function POST(req,res){
    try{
        const {users}=await connectDB();
        const payload=await req.json();
        const useremail=await users.findOne({email:payload.email});
        const usernumber=await users.findOne({contact:payload.contact});
        const username=await users.findOne({name:payload.username});
        if(useremail || usernumber){
            return NextResponse.json({error:"User already exists"},{status:403});
        }
        if(username){
            return NextResponse.json({error:"Username already exists"},{status:405});
        }
        if(payload.username[0]=='@') payload.username=payload.username.slice(1);
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(payload.password,salt);
        const obj={
            name:payload.name,
            email:payload.email,
            contact:payload.contact,
            username:payload.username,
            password:hashpassword,
            problemid:[],
            problemscore:[],
            maxspeed:0
        }
        const insertuser=await users.insertOne(obj);
        if(insertuser){
            const userid=await users.findOne({email:payload.email});
            const jwtpayload={
                userId:userid._id.toString(),
                name:payload.username,
            }
            const token=jwt.sign(jwtpayload,secretkey,{expiresIn:"1h"});
            return NextResponse.json({message:"Success",signuptoken:token},{status:200});
        }
        return NextResponse.json({error:"Error while inserting user"},{status:501});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
    
}