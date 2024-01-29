"use client"
import React,{useState,useEffect} from 'react'
import '../fullscreen.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const Page = () => {
  const router = useRouter()
  const [showcontent,setShowcontent]=useState(false);

  useEffect(() => {
      const handleResize = () => {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        setShowcontent(viewportWidth > 1100);
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
  const [wrongPassword,setWrongPassword] = useState(false)
  const [serverError,setServerError] = useState(false)
  const [usernotfound,setUsernotfound] = useState(false)
  const defaultparams={
    email:"Email or username",
    password:"Password"
  }
  const [userdetails,setUserDetails] = useState({
      email:defaultparams.email,
      password:defaultparams.password
    }
  )

    const handleSubmit = async (event) => {
      event.preventDefault()
      setServerError(false)
      setWrongPassword(false)
      setUsernotfound(false)
      let url=process.env.NEXT_PUBLIC_BACKEND
      let fetchdataurl=url+"/users/login"
      let response=await fetch(
      fetchdataurl,
      {
        method:"POST",
        body:JSON.stringify(userdetails),
        headers:{
          'Content-Type':'application/json'
        }
      }
    )
    response=await response.json()
    if (response.status === 200) {
      const userData = {
        username: response.username,
        logintoken: response.logintoken
      };
      localStorage.setItem("rapidkeyscredentials", JSON.stringify(userData));
      // const storedData = JSON.parse(userData); --> use this to get items

      // redirect to home Page
      router.push("/");

    }
    else if(response.status==401){
      setWrongPassword(true)
    }
    else if(response.status==404){
      setUsernotfound(true)
    }
    else{
      setServerError(true)
    }
  }

  return showcontent ?(
    <div className="fullscreenLogin">
      <div className="fullscreenImageContainer">
        <Image 
            src='/final3.png'
            width={420}
            height={180}
            className='fullscreenImage'
            alt="logo here"
            priority={true}
        />
      </div>
      <div className="fullscreenform">
        <input type="text" placeholder={userdetails.email} className="fullscreenbox" name="email" onChange={(e)=>setUserDetails({...userdetails,email: e.target.value === '' ? defaultparams.email : e.target.value})}/>
        <input type="password" placeholder={userdetails.password} className="fullscreenbox" name="password" onChange={(e)=>setUserDetails({...userdetails,password:e.target.value === '' ? defaultparams.password:e.target.value})}/>  
      </div>
      {wrongPassword && 
        <p className="wrong">
        Please Enter Correct Password
      </p>
      }
      {usernotfound &&
        <p className="wrong">
          User Not Found
        </p>
      }
      {serverError &&
      <p className="wrong">
        Internal Server Error
      </p>
      }
      <div className="fullscreenSubmitButton" onClick={handleSubmit}>Submit</div>
      <div className="fullscreenAdditionals">
        <div className="fullscreenredirect">
            Didn't have an account <Link href="/fullscreen/signup" className="fullscreenredirectButton">Signup Here</Link>
        </div>
        {/* <div className="fullscreenredirectHome">
            <Link href="/" className='fullscreenredirectHomeButton'>
                <Image
                    src='/home.png'
                    width={40}
                    height={40}
                    className='fullscreenredirectHomeImage'
                    alt="home button here"
                />
            </Link>
        </div> */}
      </div>
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your PC</div>
}

export default Page
