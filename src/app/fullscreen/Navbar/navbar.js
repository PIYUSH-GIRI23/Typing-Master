"use client"
import React, { useState } from 'react';
import '../fullscreen.css'
import Link from 'next/link'
export default function navbar() {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  return (
    <div className="fullscreenNavbar">
      {/* <div className="fullscreenLoginNo">
        <Link href="/fullscreen/signup" className="fullscreenSignupbutton">Signup</Link>
        <Link href="/fullscreen/login" className="fullscreenLoginbutton">Login</Link>
      </div> */}
      <div className="fullscreenLoginYes">
        <div>
          <Link href="#" className="fullscreenProfilebutton">
            {/* your username thorugh backened */}
            piyushgiri2310
          </Link>
          <span  className="fullscreenDropdownMenu" onClick={()=>setDropdownVisible(!isDropdownVisible)}>V</span>
          {isDropdownVisible && (
            <div className="fullscreendropdownContent">
              <Link href="#" className="fullscreendropdownchild">Account Details</Link>
              <hr className="hr"/>
              <Link href="#" className="fullscreendropdownchild">Statistics</Link> 
              <hr className="hr"/>
              <div className="fullscreendropdownchild" id="logout">Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
