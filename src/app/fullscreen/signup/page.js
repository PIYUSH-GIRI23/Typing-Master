"use client"
import React,{useState} from 'react'
import '../fullscreen.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const page = () => {
  const router = useRouter()
  const [userExists,setUserExists] = useState(false) // 403
  const [usernameExists,setUsernameExists] = useState(false) //405
  const [passwordnotmatch,setPasswordnotmatch] = useState(false) /// check here
  const [serverError,setServerError] = useState(false) //500
  const defaultparams={
    email:"Email",
    password:"Password",
    confirm:"Confirm Password",
    name:"Name",
    username:"Username"
  }
  const [userdetails,setUserDetails] = useState({
    email:defaultparams.email,
    password:defaultparams.password,
    confirm:defaultparams.confirm,
    name:defaultparams.name,
    username: defaultparams.username
    }
  ) 
  const handleSubmit = async (event) => {
    event.preventDefault()
    setPasswordnotmatch(false)
    setServerError(false)
    setUserExists(false)
    setUsernameExists(false)
    if(userdetails.password!==userdetails.confirm){
      setPasswordnotmatch(true)
      return
    }
    let url=process.env.NEXT_PUBLIC_BACKEND
    let fetchdataurl=url+"/users/signup"
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
    console.log(response)
    if(response.status==403){
      setUserExists(true)
    }
    else if(response.status==405){
      setUsernameExists(true)
    }
    else if(response.status==500){
      setServerError(true)
    }
    else{
      // redirect to login page
      setTimeout(()=>{
        router.push("/fullscreen/login")
      },1000)
    }
  }
  return (
    <div className="fullscreenSignup">
      <div className="fullscreenImageContainer">
        <Image 
            src='/final3.png'
            width={400}
            height={130}
            className='fullscreenImage'
            alt="logo here"
            priority={true}
        />
      </div>
      <div className="fullscreenform">
        <input type="text" placeholder={userdetails.email} className="fullscreenbox" name="email" onChange={(e)=>setUserDetails({...userdetails,email: e.target.value === '' ? defaultparams.email : e.target.value})}/>
        <input type="password" placeholder={userdetails.password} className="fullscreenbox" name="password" onChange={(e)=>setUserDetails({...userdetails,password: e.target.value === '' ? defaultparams.password : e.target.value})}/>
        <input type="password" placeholder={userdetails.confirm}className="fullscreenbox" name="confirmpassword" onChange={(e)=>setUserDetails({...userdetails,confirm: e.target.value === '' ? defaultparams.confirm : e.target.value})}/>
        <input type="text" placeholder={userdetails.name} className="fullscreenbox" name="name" onChange={(e)=>setUserDetails({...userdetails,name: e.target.value === '' ? defaultparams.name : e.target.value})}/>
        <input type="text" placeholder={userdetails.username} className="fullscreenbox" name="username" onChange={(e)=>setUserDetails({...userdetails,username: e.target.value === '' ? defaultparams.username : e.target.value})}/>
      </div>
      {userExists &&
        <p className="wrong">
          User already exists
        </p>
      }
      {usernameExists &&
        <p className="wrong">
          Username already exists
        </p>
      }
      {passwordnotmatch &&
        <p className="wrong">
          Passwords do not match
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
            Already have an account <Link href="/fullscreen/login" className="fullscreenredirectButton">Login Here</Link>
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
  )
}

export default page
