import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
import Middleware from "@/app/api/passage/middleware";
export async function PUT(req,res){
    try{
        // connecting to db
        const {passage,users}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        // verify user
        let response= await Middleware(req,payload.username,users)
        if(response.status!=200){
            return NextResponse.json({error:"Invalid Token",status:401});
        }

        // finding user thorugh email
        const useremail=await users.findOne({email:payload.email});

        // if user not found
        if(!useremail){
            return NextResponse.json({error:"User does not exists",status:404});
        }

        // finding record of passage in passage collection
        let passageExists=await passage.findOne({passageid:payload.passageid});

        // if record not found , then create new record
        if(!passageExists){
            const obj={
                passageid:payload.passageid,
                avgaccuracy:0,
                avgwpm:0,
                attempts:0,
                usernames:{},
                winner:{
                    name:"",
                    username:"",
                    maxwpm:0,
                    maxaccuracy:0
                }
            }
            // inserting new record
            await passage.insertOne(obj);
        }
        
        // now the record is inserted or already exists , now we are fetching that particular record through passageid
        passageExists=await passage.findOne({passageid:payload.passageid});

        // creating obj for updating the record
        const obj={
            attempts:passageExists.attempts+1,
            avgaccuracy:((passageExists.avgaccuracy*passageExists.attempts)+payload.accuracy)/(passageExists.attempts+1),
            avgwpm:Math.floor(((passageExists.avgwpm*passageExists.attempts)+payload.wpm)/(passageExists.attempts+1)),
            winner:{
                name:(passageExists.winner.name=="" ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95))? payload.name:passageExists.winner.name,
                username:(passageExists.winner.username=="" ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95))? payload.username:passageExists.winner.username,
                maxwpm:Math.floor((passageExists.winner.maxwpm==0 ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95) || (passageExists.winner.username===payload.username && passageExists.winner.maxwpm<payload.wpm))?payload.wpm:passageExists.winner.maxwpm),
                maxaccuracy:(passageExists.winner.maxaccuracy==0||(passageExists.winner.maxaccuracy<payload.maxaccuracy && payload.accuracy>95) || (passageExists.winner.username===payload.username && passageExists.winner.maxaccuracy<payload.accuracy))?payload.accuracy:passageExists.winner.maxaccuracy
            },
            usernames:{
                ...passageExists.usernames, // creates new object otherwise it will update the existing object
                [payload.username]:{
                    name:payload.name,
                    maxaccuracy:(passageExists.usernames[payload.username]==undefined || passageExists.usernames[payload.username].maxaccuracy<payload.accuracy)?payload.accuracy:passageExists.usernames[payload.username].maxaccuracy,
                    maxwpm:Math.floor((passageExists.usernames[payload.username]==undefined || passageExists.usernames[payload.username].maxwpm<payload.wpm)?payload.wpm:passageExists.usernames[payload.username].maxwpm)
                }
            }
        }

        // updating the record
        await passage.updateOne({ passageid: payload.passageid }, {$set:obj}, { upsert: true });

        // -----------------------------------------------------------------

        // updating user record 

        // if user has not attempted the passage
        if(useremail.passagelist[payload.passageid]==undefined){
            const userachievenments={
                attempts:1,
                maxaccuracy:payload.accuracy,
                maxwpm:Math.floor(payload.wpm),
                avegareaccuracy:payload.accuracy,
                averagewpm:Math.floor(payload.wpm)
            }
            const updateQuery = {
                $set: { [`passagelist.${payload.passageid}`]: userachievenments},
            };
            await users.updateOne({ email: payload.email }, updateQuery, { upsert: true });
        }

        // if user has attempted the passage
        else{
            const userachievenments={
                attempts:useremail.passagelist[payload.passageid].attempts+1,
                maxaccuracy:(useremail.passagelist[payload.passageid].maxaccuracy==0 || useremail.passagelist[payload.passageid].maxaccuracy<payload.accuracy)?payload.accuracy:useremail.passagelist[payload.passageid].maxaccuracy,
                maxwpm:Math.floor((useremail.passagelist[payload.passageid].maxwpm==0 || useremail.passagelist[payload.passageid].maxwpm<payload.wpm)?payload.wpm:useremail.passagelist[payload.passageid].maxwpm),
                avegareaccuracy:((useremail.passagelist[payload.passageid].avegareaccuracy*useremail.passagelist[payload.passageid].attempts)+payload.accuracy)/(useremail.passagelist[payload.passageid].attempts+1),
                averagewpm:Math.floor(((useremail.passagelist[payload.passageid].averagewpm*useremail.passagelist[payload.passageid].attempts)+payload.wpm)/(useremail.passagelist[payload.passageid].attempts+1))
            }
            const updateQuery = {
                $set: { [`passagelist.${payload.passageid}`]: userachievenments},
            };
    
            await users.updateOne({ email: payload.email }, updateQuery, { upsert: true });
        }

        // updating maxwpm and maxaccuracy
        if(useremail.maxwpm<payload.wpm){
            await users.updateOne({email:payload.email},{$set:{maxwpm:payload.wpm}});
        }
        if(useremail.maxaccuracy<payload.accuracy){
            await users.updateOne({email:payload.email},{$set:{maxaccuracy:payload.accuracy}});
        }
        return NextResponse.json({message:"Success",status:200});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
}