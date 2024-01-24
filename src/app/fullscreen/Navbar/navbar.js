"use client"
import React, { useState,useEffect } from 'react';
import '../fullscreen.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function navbar() {
  const router=useRouter();
  const [islogin, setLogin] = useState(false);
  const [loginusername,setLoginUsername] = useState("");
  useEffect(()=>{
    const data=localStorage.getItem("typingmastercredentials");
    const storedData = JSON.parse(data);
    if(storedData && storedData.logintoken && storedData.username){ 
      setLogin(true);
      setLoginUsername(storedData.username);
    }
  },[])
  const handleLogout = () => {
    localStorage.removeItem("typingmastercredentials");
    setLogin(false);
    router.push("/fullscreen/login");
  }
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  return (
    <div className="fullscreenNavbar">
    {!islogin &&
      <div className="fullscreenLoginNo">
        <Link href="/fullscreen/signup" className="fullscreenSignupbutton">Signup</Link>
        <Link href="/fullscreen/login" className="fullscreenLoginbutton">Login</Link>
      </div>
    }
      {islogin &&
        <div className="fullscreenLoginYes">
          <div>
            <Link href="#" className="fullscreenProfilebutton">
              {loginusername}
            </Link>
            <span  className="fullscreenDropdownMenu" onClick={()=>setDropdownVisible(!isDropdownVisible)}>V</span>
            {isDropdownVisible && (
              <div className="fullscreendropdownContent">
                <Link href="#" className="fullscreendropdownchild">Account Details</Link>
                <hr className="hr"/>
                <Link href="/fullscreen/statistics" className="fullscreendropdownchild">Statistics</Link> 
                <hr className="hr"/>
                <div className="fullscreendropdownchild" id="logout" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  )
}
