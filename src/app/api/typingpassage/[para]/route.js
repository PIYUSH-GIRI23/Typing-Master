import { NextResponse } from "next/server";
import { typingPassage1 } from "@/app/content/00.js";
import { typingPassage2 } from "@/app/content/01.js";
import { typingPassage3 } from "@/app/content/10.js";
import { typingPassage4 } from "@/app/content/11.js";
export async function GET(req,res){
    try{
        console.log("hello")
        let typingPassage;
        const para=res.params.para;
        console.log(para)
        if(para<200 && para>=100) typingPassage=typingPassage1;
        else if(para<300 && para>=200) typingPassage=typingPassage2;
        else if(para<400 && para>=300) typingPassage=typingPassage3;
        else if (para<500 && para>=400)typingPassage=typingPassage4;
        else return NextResponse.json({error:"Para not found",status:404});
        const selectedPassage = typingPassage.find(
            (passage) => passage.passage_id == para
        );
        if (!selectedPassage) {
            return NextResponse.json({error: "Passage not found for the given para",status: 404});
        }
      
          // Send the selected passage details
        return NextResponse.json({details:selectedPassage,status:200});

    }
    catch(error){
        // console.error(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
}