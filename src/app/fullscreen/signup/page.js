import React from 'react'
import '../fullscreen.css'
import Image from 'next/image'
import Link from 'next/link'
const page = () => {
  return (
    <div className="fullscreenSignup">
      <div className="fullscreenImageContainer">
        <Image 
            src='/croppedlogo.png'
            width={420}
            height={180}
            className='fullscreenImage'
            alt="logo here"
            priority={true}
        />
      </div>
      <div className="fullscreenform">
        <input type="text" placeholder="email" className="fullscreenbox" name="email"/>
        <input type="password" placeholder="password" className="fullscreenbox" name="password"/>
        <input type="password" placeholder="confirm password" className="fullscreenbox" name="confirmpassword"/>
        <input type="text" placeholder="name" className="fullscreenbox" name="name"/>
        <input type="text" placeholder="username" className="fullscreenbox" name="username  "/>
      </div>
      <div className="fullscreenSubmitButton">Submit</div>
      <div className="fullscreenAdditionals">
        <div className="fullscreenredirect">
            Already have an account <Link href="/fullscreen/login" className="fullscreenredirectButton">Login Here</Link>
        </div>
        <div className="fullscreenredirectHome">
            <Link href="/" className='fullscreenredirectHomeButton'>
                <Image
                    src='/home.png'
                    width={40}
                    height={40}
                    className='fullscreenredirectHomeImage'
                    alt="home button here"
                />
            </Link>
        </div>
      </div>
    </div>
  )
}

export default page
