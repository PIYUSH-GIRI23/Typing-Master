import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";

export async function GET(req,res){
    // getting username from url
    let username=res.params.user;
    try{
        // connecting to db
        const {users}=await connectDB();
        // finding user through username
        const userdetails=await users.findOne({username:username});
        // if user not found
        if(!userdetails){
            return NextResponse.json({error:"user not found",status:404});
        }

        // if user found , then return the details
        const obj={
            username:userdetails.username,
            name:userdetails.name,
            email:userdetails.email,
            createdAt:userdetails.createdAt,
            maxwpm:userdetails.maxwpm,
            maxaccuracy:userdetails.maxaccuracy,
            passagelist:userdetails.passagelist,
            datewise:userdetails.datewise,
            totalattempt:userdetails.totalattempt,
            totalpassages:userdetails.totalpassages
        }
        return NextResponse.json({details:obj,status:200});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
}