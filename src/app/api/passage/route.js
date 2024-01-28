import connectDB from "@/app/database/db";
import { NextResponse } from "next/server";
import Middleware from "@/app/api/passage/middleware";
export async function PUT(req,res){
    try{
        // connecting to db
        const {passage,users,leaderboard}=await connectDB();

        // getting payload(email/username , password)
        const payload=await req.json();

        // verify user
        let response= await Middleware(req,payload.username,users)
        if(response.status!=200){
            return NextResponse.json({error:"Invalid Token",status:401});
        }

        // finding user thorugh email
        const username=await users.findOne({username:payload.username});

        // if user not found
        if(!username){
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
            avgaccuracy:(((passageExists.avgaccuracy*passageExists.attempts)+payload.accuracy)/(passageExists.attempts+1)).toFixed(2),
            avgwpm:Math.floor(((passageExists.avgwpm*passageExists.attempts)+payload.wpm)/(passageExists.attempts+1)),
            winner:{
                name:(passageExists.winner.name=="" ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95))? username.name:passageExists.winner.name,
                username:(passageExists.winner.username=="" ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95))? payload.username:passageExists.winner.username,
                maxwpm:Math.floor((passageExists.winner.maxwpm==0 ||(passageExists.winner.maxwpm<payload.wpm && payload.accuracy>95) || (passageExists.winner.username===payload.username && passageExists.winner.maxwpm<payload.wpm))?payload.wpm:passageExists.winner.maxwpm),
                maxaccuracy:(passageExists.winner.maxaccuracy==0||(passageExists.winner.maxaccuracy<payload.maxaccuracy && payload.accuracy>95) || (passageExists.winner.username===payload.username && passageExists.winner.maxaccuracy<payload.accuracy))?(payload.accuracy.toFixed(2)):passageExists.winner.maxaccuracy
            },
            usernames:{
                ...passageExists.usernames, // creates new object otherwise it will update the existing object
                [payload.username]:{
                    name:username.name,
                    maxaccuracy:(passageExists.usernames[payload.username]==undefined || passageExists.usernames[payload.username].maxaccuracy<payload.accuracy)?(payload.accuracy.toFixed(2)):passageExists.usernames[payload.username].maxaccuracy,
                    maxwpm:Math.floor((passageExists.usernames[payload.username]==undefined || passageExists.usernames[payload.username].maxwpm<payload.wpm)?payload.wpm:passageExists.usernames[payload.username].maxwpm)
                }
            }
        }

        // updating the record
        await passage.updateOne({ passageid: payload.passageid }, {$set:obj}, { upsert: true });

        // -----------------------------------------------------------------

        // updating user record 

        // if user has not attempted the passage
        if(username.passagelist[payload.passageid]==undefined){
            const userachievenments={
                attempts:1,
                maxaccuracy:payload.accuracy.toFixed(2),
                maxwpm:Math.floor(payload.wpm),
                avegareaccuracy:payload.accuracy.toFixed(2),
                averagewpm:Math.floor(payload.wpm)
            }
            const updateQuery = {
                $set: { [`passagelist.${payload.passageid}`]: userachievenments},
            };
            await users.updateOne({username:payload.username}, updateQuery, { upsert: true });
        }
        
        // if user has attempted the passage
        else{
            const userachievenments={
                attempts:username.passagelist[payload.passageid].attempts+1,
                maxaccuracy:(username.passagelist[payload.passageid].maxaccuracy==0 || username.passagelist[payload.passageid].maxaccuracy<payload.accuracy)?(payload.accuracy.toFixed(2)):username.passagelist[payload.passageid].maxaccuracy,
                maxwpm:Math.floor((username.passagelist[payload.passageid].maxwpm==0 || username.passagelist[payload.passageid].maxwpm<payload.wpm)?payload.wpm:username.passagelist[payload.passageid].maxwpm),
                avegareaccuracy:(((username.passagelist[payload.passageid].avegareaccuracy*username.passagelist[payload.passageid].attempts)+payload.accuracy)/(username.passagelist[payload.passageid].attempts+1)).toFixed(2),
                averagewpm:Math.floor(((username.passagelist[payload.passageid].averagewpm*username.passagelist[payload.passageid].attempts)+payload.wpm)/(username.passagelist[payload.passageid].attempts+1))
            }
            const updateQuery = {
                $set: { [`passagelist.${payload.passageid}`]: userachievenments},
            };
            
            await users.updateOne({username:payload.username}, updateQuery, { upsert: true });
        }
        const currentDate = new Date();
        const formattedDate = currentDate.getDate()
        if(username.datewise[formattedDate]==undefined){
            const datewise={
                ...username.datewise,
                [formattedDate]:{
                    attempts:1,
                    maxaccuracy:payload.accuracy.toFixed(2),
                    maxwpm:Math.floor(payload.wpm),
                }
            }
            const updateQuery = {
                $set: { datewise },
            };
            await users.updateOne({ username:payload.username }, updateQuery, { upsert: true });
        }
        else{
            const datewise={
                ...username.datewise,
                [formattedDate]:{
                    attempts:username.datewise[formattedDate].attempts+1,
                    maxaccuracy:((username.datewise[formattedDate].maxaccuracy==0 || username.datewise[formattedDate].maxaccuracy<payload.accuracy)?payload.accuracy:username.datewise[formattedDate].maxaccuracy),
                    maxwpm:Math.floor((username.datewise[formattedDate].maxwpm==0 || username.datewise[formattedDate].maxwpm<payload.wpm)?payload.wpm:username.datewise[formattedDate].maxwpm).toFixed(2),
                }
            }
            const updateQuery = {
                $set: { datewise },
            };
            await users.updateOne({ username:payload.username}, updateQuery, { upsert: true });
        }
        
        // updating maxwpm and maxaccuracy
        if(username.maxwpm<payload.wpm){
            await users.updateOne({username:payload.username},{$set:{maxwpm:payload.wpm}});
        }
        if(username.maxaccuracy<payload.accuracy){
            await users.updateOne({username:payload.username},{$set:{maxaccuracy:payload.accuracy}});
        }
        // updating totalattempt and totalpassages
        await users.updateOne({username:payload.username},{$set:{totalattempt:username.totalattempt+1}});
        await users.updateOne({username:payload.username},{$set:{totalpassages:username.totalpassages+1}});



        // now adding new user to leaderboard;
        const inleaderboard=await leaderboard.findOne({
            [payload.username]:{
                $exists: true,
                $not: { $eq: {} }
            }
        });
        // {
        //     [`usernames.${payload.username}`]: {
        //       $exists: true,
        //       $not: { $eq: {} }
        //     }
        //   },
        //   {
        //     $rename: {
        //       [`usernames.${payload.username}`]: `usernames.${payload.newusername}`
        //     }
        //   }
        // );
        if(!inleaderboard){
            const obj={
                [payload.username]:{
                    accuracy:payload.accuracy.toFixed(2),
                    wpm:Math.floor(payload.wpm),
                    lastactive:formattedDate
                }
            }
            await leaderboard.insertOne(obj);
        
        }
        else{
            const obj={
                accuracy:(inleaderboard[payload.username]==undefined || inleaderboard[payload.username].accuracy<payload.accuracy)?payload.accuracy.toFixed(2):inleaderboard[payload.username].accuracy,
                wpm:Math.floor((inleaderboard[payload.username]==undefined || inleaderboard[payload.username].wpm<payload.wpm)?payload.wpm:inleaderboard[payload.username].wpm),
                lastactive:formattedDate
            }
            const updateQuery = {
                $set: { [payload.username]: obj },
            };
            await leaderboard.updateOne({[payload.username]:{
                $exists: true,
                $not: { $eq: {} }
            }}, updateQuery, { upsert: true });
        
        }
        // const allRecords = await collection.find({}).toArray();
        return NextResponse.json({message:"Success",status:200});

    }
    catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error",status:500});
    }
}