"use client"
import React ,{useState} from 'react'
import "../../fullscreen.css"
import Navbar from '@/app/fullscreen/Navbar/navbar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
const page = () => {
  const [passwordmach,setpasswordmach]=useState(false);
  const [serverError,setserverError]=useState(false);
  const [usernotfound,setusernotfound]=useState(false);
  const [wrongNumber,setwrongNumber]=useState(false);
  const [mandatory,setmandatory]=useState(false);
  const router=useRouter();
  const general={
    username:"Enter your Username",
    password:"Enter your Password",
    newusername:"Enter your new Username (if not, type original username)",
    newpassword:"Enter your new Password (if not, type original password)"
  }
  const [userdetails,setuserdetails]=useState({
    username:general.username,
    password:general.password,
    newusername:general.newusername,
    newpassword:general.newpassword
  })
  const handleclick=async()=>{
    setpasswordmach(false);
    setserverError(false);
    setusernotfound(false);
    setwrongNumber(false);
    setmandatory(false);
    let url=process.env.NEXT_PUBLIC_BACKEND;
    const apifetch=`${url}/users/modify`;
    const data=localStorage.getItem("rapidkeyscredentials");
    const storedData = JSON.parse(data);
    if(storedData.username!==userdetails.username){
      setwrongNumber(true);
      return;
    }
    if(userdetails.newusername==general.newusername || userdetails.newpassword==general.newpassword){
        setmandatory(true);
        return;
    }
    console.log(userdetails)
    let res=await fetch(
      apifetch,
      {
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "loginToken":storedData.logintoken
        },
        body:JSON.stringify(userdetails)
      }
    )
    res=await res.json();
    if(res.status==200){
        localStorage.removeItem("typingmastercredentials");
        router.push("/fullscreen/login");
    }
    else if(res.status==404){
      setusernotfound(true);
      return;
    }
    else if(res.status==401){
      setpasswordmach(true);
      return;
    }
    else if(res.status==403){
      setwrongNumber(true);
      return;
    }
    else{
      setserverError(true);
      return;
    }
  }
  return (
    <div  className="userdeletecontainer">
      <Navbar/>
      <div className="updatecontainer">
        <div className="homebutton">
          <Link href="/" className="homebuttonLink">
            <Image
              src="/home.png"
              alt="Picture of the author"
              width={50}
              height={50}
            />
          </Link>
        </div>
        <div className="warning">Updating this Account will not affect your past Performance ..<br/>You will be Logged Out automatically...</div>
        <div className="updateparams">
          <input className="deleteusernameparams" type="text" placeholder={userdetails.username} onChange={(e)=>{setuserdetails({...userdetails,username:(e.target.value=="")?general.username:e.target.value})}}/>
          <input className="deletepasswordparams" type="password" placeholder={userdetails.password} onChange={(e)=>{setuserdetails({...userdetails,password:e.target.value==""?general.password:e.target.value})}}/>
            <input className="deleteusernameparams" type="text" placeholder={userdetails.newusername} onChange={(e)=>{setuserdetails({...userdetails,newusername:(e.target.value=="")?general.newusername:e.target.value})}}/>
            <input className="deletepasswordparams" type="password" placeholder={userdetails.newpassword} onChange={(e)=>{setuserdetails({...userdetails,newpassword:e.target.value==""?general.newpassword:e.target.value})}}/>
        </div>  
        {
          passwordmach && <div className="chotiwarning">Wrong password</div>
        }
        {
          serverError && <div className="chotiwarning">Internal Server Error</div>
        }
        {
          usernotfound && <div className="chotiwarning">User not found</div>
        }
        {
          mandatory && <div className="chotiwarning">Please fill the mandatory fields</div>
        }
        {wrongNumber && <div className="chotiwarning">
          Unauthorised access
          {setTimeout(() => {
            localStorage.removeItem("typingmastercredentials");
            router.push("/fullscreen/login");
          }, 1000)}
        </div>
        }
        <div className="deletebutton" onClick={handleclick}>Update</div>
      </div>
    </div>
  )
}

export default page
