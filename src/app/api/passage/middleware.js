const jwt=require("jsonwebtoken");
import { headers } from 'next/headers'
const { ObjectId } = require('mongodb');
const secretkey=process.env.SECRET_KEY; //env variable
export default async function middleware(req,username,users){
    try{
        const headersList = headers()
        const token = headersList.get('logintoken')
        console.log(token)  
        if(!token){
            return {message:"Invalid Token",status:401};
        }
        const decoded=jwt.verify(token,secretkey);
        const userid= new ObjectId(decoded.userId)
        const user=await users.findOne({_id : userid})
        if(username!=user.username){
            return {message:"Invalid Token",status:401};
        }
        return {message:"Success",status:200};
    }
    catch(error){
        console.log(error);
        return {message:"Internal Server Error",status:500};
    }
}