"use client"
import React ,{useState,useEffect} from 'react'
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
  const router=useRouter();
  const [showcontent,setShowcontent]=useState(false);

  useEffect(() => {
      const handleResize = () => {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        setShowcontent(viewportWidth > 1000);
      };

      // Initial check on mount
      handleResize();

      // Event listener for window resize
      window.addEventListener('resize', handleResize);

      return () => {
        // Cleanup: remove the event listener
        window.removeEventListener('resize', handleResize);
      };
  }, []);
  const general={
    username:"Enter your Username",
    password:"Enter your Password"
  }
  const [userdetails,setuserdetails]=useState({
    username:general.username,
    password:general.password
  })
  const handleclick=async()=>{
    setpasswordmach(false);
    setserverError(false);
    setusernotfound(false);
    setwrongNumber(false);
    let url=process.env.NEXT_PUBLIC_BACKEND;
    const apifetch=`${url}/users/resetpassagedata`;
    const data=localStorage.getItem("rapidkeyscredentials");
    const storedData = JSON.parse(data);
    if(storedData.username!==userdetails.username){
      setwrongNumber(true);
      return;
    }
    let res=await fetch(
      apifetch,
      {
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          "loginToken":storedData.logintoken
        },
        body:JSON.stringify(userdetails)
      }
    )
    res=await res.json();
    console.log(res)
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
  return showcontent ?(
    <div  className="userdeletecontainer">
      <Navbar/>
      <div className="deletecontainer">
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
        <div className="warning">Resetting this Account will result in loss of all of your Past Performance ..<br/>You Have to start from Scratch ...</div>
        <div className="deleteparams">
          <input className="deleteusernameparams" type="text" placeholder={userdetails.username} onChange={(e)=>{setuserdetails({...userdetails,username:(e.target.value=="")?general.username:e.target.value})}}/>
          <input className="deletepasswordparams" type="password" placeholder={userdetails.password} onChange={(e)=>{setuserdetails({...userdetails,password:e.target.value==""?general.password:e.target.value})}}/>
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
        {wrongNumber && <div className="chotiwarning">
          Unauthorised access
          {setTimeout(() => {
            localStorage.removeItem("typingmastercredentials");
            router.push("/fullscreen/login");
          }, 1000)}
        </div>
        }
        <div className="deletebutton" onClick={handleclick}>Reset</div>
      </div>
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>
}

export default page
