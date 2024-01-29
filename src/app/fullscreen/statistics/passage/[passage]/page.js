"use client"
import React,{useState,useEffect} from 'react'
import "../../../fullscreen.css"
import Navbar from '@/app/fullscreen/Navbar/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const Page = ({params}) => {
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
  let [contestTime,setcontestTime]=useState({
    min:'00',
    sec:'30'
  }); 
  const  [passageDetails,setpassageDetails]=useState({});
  const [passagenotfound,setpassagenotfound]=useState(!false);
  const [correcttime,setcorrecttime]=useState(false)
  const [modal,setmodal]=useState(false);
  let url=process.env.NEXT_PUBLIC_BACKEND;
  const apifetch=`${url}/view/passagedetails/${params.passage}`
  async function getpassagedetails(){
    let res=await fetch(apifetch);
    res=await res.json();
    // console.log(res)
    if(res.status===200){
      setpassagenotfound(!false);
      let {details,extra}=res;
      setpassageDetails(details);
      console.log(details)
      // console.log(details[winner])
    }
    else{
      setpassagenotfound(!true);
      return;
    }
  }
  useEffect(()=>{
    getpassagedetails();
  },[params.passage]) 
  const taketestbutton=()=>{
    setcorrecttime(false);
    let min=contestTime.min;
    let sec=contestTime.sec;
    if(min.length==1){
      min='0'+min;
    }
    if(sec.length==1){
      sec='0'+sec;
    }
    console.log(min,sec)
    const arr=[parseInt(min[0]),parseInt(min[1]),parseInt(sec[0]),parseInt(sec[1])]
    console.log(arr)
    if((arr[0]==0 && arr[1]==0 && arr[2]==0 && arr[3]==0) || isNaN(arr[0]) || isNaN(arr[1]) || isNaN(arr[2]) || isNaN(arr[3])){
      setcorrecttime(true);
      // console.log("no")
    }
    const timemin=parseInt(arr[0]*10*60+arr[1]*60);
    const timesec=parseInt(arr[2]*10+arr[3]);
    if(timemin>59*60 || timesec>59){
      // console.log("no")
      setcorrecttime(true)
    }
    else{
      // console.log(timemin+timesec,numbers,symbols);
      // console.log("yes")
      router.push(`/fullscreen/typing/${params.passage}/${timemin+timesec}`);
    }
  }
  return showcontent ?(
    <div>
      <Navbar/>
      <div className={modal?"fullscreentestmodal":"fullscreentestmodal2"}>
        <div className="fullscreencrossbutton" onClick={()=>setmodal(!modal)}>&times;</div>
        <div className="fullscreentesttimings">
          <div className='fullscreenhomepagecenterbottomcontestboxtime fullscreenmodalinputtime'>
            <input id='mininput' className='fullscreenhomepagecenterbottomcontestboxinputhr' value={contestTime.min} maxLength={2}  onChange={(e)=>setcontestTime({...contestTime,min:e.target.value})}/>
            <div className='fullscreenhomepagecenterbottomcontestboxinputcolon'>:</div>
            <input id='secinput' className='fullscreenhomepagecenterbottomcontestboxinputmin' value={contestTime.sec} maxLength={2} onChange={(e)=>setcontestTime({...contestTime,sec:e.target.value})}/>
          </div>
          <div className='fullscreenhomepagecenterbottomcontestboxtimedefault fullscreenmodaldefaulttime'>
            <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'01',sec:'00'})}>1 min</div>
            <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'02',sec:'00'})}>2 min</div>
            <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'05',sec:'00'})}>5 min</div>
            <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'10',sec:'00'})}>10 min</div>
          </div>
        </div>
        {
          correcttime && 
          <div className='warning fullscreenpassagemodaltime'>Please enter correct time</div>
        }
        <div className="fullscreentaketestbutton" onClick={taketestbutton}>Take Test</div>
      </div>
      {localStorage.getItem("rapidkeyscredentials") && passagenotfound &&
      <div className={!modal?"fullscreenspecificpassage":"fullscreenspecificpassage2"}>
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
            {/* <Link className='fullscreenspecificpassageleftsidebottomebutton' href={`/fullscreen/typing/${params.passage}`}>Take Test</Link> */}
            <div className='fullscreenspecificpassageleftsidebottomebutton' onClick={()=>setmodal(!modal)}>Take Test</div>
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
          router.push("/fullscreen/Login");
        }, 2000)}
        </div>
      }
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>
}

export default Page
