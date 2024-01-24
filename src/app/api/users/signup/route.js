import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const secretkey=process.env.SECRET_KEY; // env variable
export async function POST(req,res){
    try{
        // connecting to db
        const {users}=await connectDB();

        // getting payload(name,email,contact,username,password)
        const payload=await req.json();

        // removing @ from starting of username
        if(payload.username[0]=='@') payload.username=payload.username.slice(1);

        // checking if user exists
        const userExists = await users.findOne({email: payload.email})  
        if (userExists) {
            return NextResponse.json({ error: "User already exists" ,status:403});
        }

        // checking if username exists
        const username=await users.findOne({username:payload.username});
        if(username){
            return NextResponse.json({error:"Username already exists",status:405});
        }

        // encryting password
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(payload.password,salt);

        // inserting user
        const obj={
            name:payload.name,
            email:payload.email,
            username:payload.username,
            password:hashpassword,
            passagelist:{},
            maxwpm:0,
            maxaccuracy:0
        }
        const insertuser=await users.insertOne(obj);

        // if insertion is successfull
        if(insertuser){
            return NextResponse.json({message:"Success",status:200});
        }
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
    
}