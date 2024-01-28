/*
{
    numberinclude:0,
    symbolinclude:1
}
*/

import { NextResponse } from "next/server";
import { typingPassage1 } from "@/app/content/00.js";
import { typingPassage2 } from "@/app/content/01.js";
import { typingPassage3 } from "@/app/content/10.js";
import { typingPassage4 } from "@/app/content/11.js";
const randompassage=(passageArray)=>{
    const randomIndex = Math.floor(Math.random() * passageArray.length);
    // return passageArray[randomIndex];
    return passageArray[randomIndex].passage_id;
}
export async function POST(req,res){
    try{
        const payload=await req.json();
        const {numberinclude,symbolinclude}=payload;
        let response;
        if(numberinclude==0 && symbolinclude==0){
            response=randompassage(typingPassage1);
        }
        else if(numberinclude==0 && symbolinclude==1){
            response=randompassage(typingPassage2);
        }
        else if(numberinclude==1 && symbolinclude==0){
            response=randompassage(typingPassage3);
        }
        else if(numberinclude==1 && symbolinclude==1){
            response=randompassage(typingPassage4);
        }
        else return NextResponse.json({error:"Invalid payload",status:400});
        return NextResponse.json({details:response,status:200});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
}