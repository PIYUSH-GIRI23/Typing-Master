"use client"
import React,{useState,useEffect} from 'react'
import "../../../fullscreen.css"
import Navbar from '@/app/fullscreen/Navbar/navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const page = ({params}) => {
  const router=useRouter();
  const  [passageDetails,setpassageDetails]=useState({});
  const [passagenotfound,setpassagenotfound]=useState(false);
  let url=process.env.NEXT_PUBLIC_BACKEND;
  const apifetch=`${url}/view/passagedetails/${params.passage}`
  async function getpassagedetails(){
    let res=await fetch(apifetch);
    res=await res.json();
    // console.log(res)
    if(res.status===200){
      setpassagenotfound(false);
      let {details,extra}=res;
      setpassageDetails(details);
      console.log(details)
      // console.log(details[winner])
    }
    else{
      setpassagenotfound(true);
      return;
    }
  }
  useEffect(()=>{
    getpassagedetails();
  },[params.passage]) 
  return (
    <div>
      <Navbar/>
      {localStorage.getItem("rapidkeyscredentials") && passagenotfound &&
      <div className='fullscreenspecificpassage'>
        <div className="fullscreenspecificpassageleftside">
          <div className="fullscreenspecificpassageleftsidetop">
            <div className='fullscreenspecificpassageleftsidetopheader'>
              Passage stats
            </div>
            <div className='fullscreenspecificpassageleftsidetopelemcontainer'>
              <div className='fullscreenspecificpassageleftsidetopelem'>Passage Id : {params.passage}</div>
              <div className='fullscreenspecificpassageleftsidetopelem'>Avg accuracy : {passageDetails.avgaccuracy}%</div>
              <div className='fullscreenspecificpassageleftsidetopelem'>Avg Wpm : {passageDetails.avgwpm}</div>
              <div className='fullscreenspecificpassageleftsidetopelem'>Total Attempts : {passageDetails.attempts}</div>
            </div>
          </div>
          <div className="fullscreenspecificpassageleftsidebottom">
            <Link className='fullscreenspecificpassageleftsidebottomebutton' href={`/fullscreen/typing/showpara/${params.passage}`}>View Passage</Link>
            <Link className='fullscreenspecificpassageleftsidebottomebutton' href={`/fullscreen/typing/${params.passage}`}>Take Test</Link>
          </div>
        </div>
        <div className="fullscreenspecificpassagerightside">
          <div className='fullscreenspecificpassagerightsidetop'>
            <div className='fullscreenspecificpassagerightsidetopheader'>
              Users Stats
            </div>
            <div className='fullscreenspecificpassagerightsidetopelemcontainer'>
              <div className='fullscreenspecificpassagerightsidetopelemcontainerdefault'>
                <div className='fullscreenspecificpassagerightsidetopelem'>UserName</div>
                <div className='fullscreenspecificpassagerightsidetopelem'>Name</div>
                <div className='fullscreenspecificpassagerightsidetopelem'>Max Accuracy</div>
                <div className='fullscreenspecificpassagerightsidetopelem'>Max Wpm</div>
              </div>
              <hr className="hr2"/>
              <div className='fullscreenspecificpassagerightsidetopelemcontainergenrated'>
                  {passageDetails.usernames && Object.entries(passageDetails.usernames).map(([username, userdetails]) => (
                <Link className='fullscreenspecificpassagerightsidetopelemcontainergeneratedLink' key={username}  href={`/fullscreen/statistics/${username}`}>
                  <div className="fullscreenspecificpassagerightsidetopelemcontainergeneratedchildelem">{username}</div>
                  <div className="fullscreenspecificpassagerightsidetopelemcontainergeneratedchildelem">{userdetails.name}</div>
                  <div className="fullscreenspecificpassagerightsidetopelemcontainergeneratedchildelem">{userdetails.maxaccuracy}%</div>
                  <div className="fullscreenspecificpassagerightsidetopelemcontainergeneratedchildelem">{userdetails.maxwpm}</div>
                </Link>
              ))}
              </div>
            </div>
          </div>
          <hr className="hr"/>
          <div className='fullscreenspecificpassagerightsidebottom'>
            <div className='fullscreenspecificpassageeightsidebottomheader'>
              Winner Stats
            </div>
            <div className='fullscreenspecificpassagerightsidebottomelemcontainer'>
            {/* {passageDetails.winner && Object.entries(passageDetails.winner).map(([username, userdetails]) => (
                
              ))} */}
              {passageDetails.winner && <div className='fullscreenspecificpassagerightsidebottomelemcontainer'>
                  <Link  href={`/fullscreen/statistics/${passageDetails.winner.username}`} className="fullscreenspecificpassagerightsidebottomelem">Username : {passageDetails.winner.username}</Link>
                  <div className="fullscreenspecificpassagerightsidebottomelem">Name : {passageDetails.winner.name}</div>
                  <div className="fullscreenspecificpassagerightsidebottomelem">Max Accuracy : {passageDetails.winner.maxaccuracy}%</div>
                  <div className="fullscreenspecificpassagerightsidebottomelem">Max Wpm : {passageDetails.winner.maxwpm}</div>
                </div>}
            </div>
          </div>
        </div>
      </div>}
      {!localStorage.getItem("rapidkeyscredentials") && passagenotfound && <div className="fullscreenusernotfound">
        <h1>Passage Not Found</h1>
        {setTimeout(() => {
          localStorage.removeItem("typingmastercredentials");
          router.push("/fullscreen/login");
        }, 2000)}
        </div>
      }
    </div>
  )
}

export default page
