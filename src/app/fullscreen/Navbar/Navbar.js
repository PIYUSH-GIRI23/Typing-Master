"use client"
import React, { useState,useEffect } from 'react';
import '../fullscreen.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
export default function Navbar() {
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
  const router=useRouter();
  const data=localStorage.getItem("rapidkeyscredentials");
    if(data===null){
      router.push("/fullscreen/Login");
    }
    const storedData = JSON.parse(data);
    if(storedData && storedData.logintoken && storedData.username){ 
    }
  const [islogin, setLogin] = useState(localStorage.getItem("rapidkeyscredentials") && false);
  const [loginusername,setLoginUsername] = useState("");
  useEffect(()=>{
    const data=localStorage.getItem("rapidkeyscredentials");
    const storedData = JSON.parse(data);
    if(storedData && storedData.logintoken && storedData.username){ 
      setLogin(true);
      setLoginUsername(storedData.username);
    }
  },[])
  const handleLogout = () => {
    localStorage.removeItem("rapidkeyscredentials");
    setLogin(false);
    router.push("/fullscreen/Login");
  }
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  return showcontent ?(
    <div className="fullscreenNavbar">
      <div className="fullscreenredirectHome">
            <Link href="/" className='fullscreenredirectHomeButton'>
                <Image
                    src='/final3.png'
                    width={260}
                    height={120}
                    className='fullscreenredirectHomeImagelogo'
                    alt="home button here"
                    priority={true}
                />
            </Link>
        </div>
    {!islogin &&
      <div className="fullscreenLoginNo">
        <Link href="/fullscreen/signup" className="fullscreenSignupbutton">Signup</Link>
        <Link href="/fullscreen/login" className="fullscreenLoginbutton">Login</Link>
      </div>
    }
      {islogin &&
        <div className="fullscreenLoginYes">
          <div>
            <Link href={`/fullscreen/statistics/accountdetails/${loginusername}`} className="fullscreenProfilebutton">
              {loginusername}
            </Link>
            <span  className="fullscreenDropdownMenu" onClick={()=>setDropdownVisible(!isDropdownVisible)}>V</span>
            {isDropdownVisible && (
              <div className="fullscreendropdownContent">
                <Link href="/" className="fullscreendropdownchild">Home</Link>
                <hr className="hr"/>
                <Link href={`/fullscreen/statistics/accountdetails/${loginusername}`} className="fullscreendropdownchild">Account Details</Link>
                <hr className="hr"/>
                <Link href={`/fullscreen/statistics/${loginusername}`} className="fullscreendropdownchild">Statistics</Link> 
                <hr className="hr"/>
                <div className="fullscreendropdownchild" id="logout" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>
}
