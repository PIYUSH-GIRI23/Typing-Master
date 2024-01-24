"use client"
import React from 'react'
import '../fullscreen.css'
import Link from 'next/link'
export default function navbar() {
  return (
    <div className="fullscreenNavbar">
      <div className="fullscreenLoginNo">
        <Link href="/fullscreen/signup" className="fullscreenSignupbutton">Signup</Link>
        <Link href="/fullscreen/login" className="fullscreenLoginbutton">Login</Link>
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
