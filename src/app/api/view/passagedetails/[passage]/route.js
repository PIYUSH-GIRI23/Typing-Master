import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";

export async function GET(req,res){
    // getting passageid from url
    let passage_id=parseInt(res.params.passage);
    try{
        // connecting to db
        const {passage}=await connectDB();

        // finding passage through passageid
        const passagedetails=await passage.findOne({passageid:passage_id});
        // if passage not found
        if(!passagedetails){
            return NextResponse.json({error:"Passage not found"},{status:404});
        }

        // if passage found , then return the details
        const obj={
            avgaccuracy:passagedetails.avgaccuracy,
            avgwpm:passagedetails.avgwpm,
            attempts:passagedetails.attempts,
            winnner:{
                maxaccuracy:passagedetails.winner.maxaccuracy,
                maxwpm:passagedetails.winner.maxwpm,
                username:passagedetails.winner.username
            },
            usernames:passagedetails.usernames
        }
        return NextResponse.json(obj,{status:200});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}