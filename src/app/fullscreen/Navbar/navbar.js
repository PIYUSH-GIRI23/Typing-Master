"use client"
import React from 'react'
import '../fullscreen.css'
import Link from 'next/link'
export default function navbar() {
  return (
    <div className="fullscreenNavbar">
      <div className="fullscreenAboutus">
        <Link href="#" className="fullscreenAboutusButton">About Us</Link>
      </div >
      <div className="fullscreenLoginNo">
        <Link href="#" className="fullscreenSignupbutton">Signup</Link>
        <Link href="#" className="fullscreenLoginbutton">Login</Link>
      </div>
      <div className="fullscreenLoginYes">
        <div>
          <Link href="#" className="fullscreenProfilebutton">
            {/* your username thorugh backened */}
            piyushgiri2310
          </Link>
          <span  className="fullscreenDropdownMenu">V</span>
        </div>
      </div>
    </div>
  )
}
