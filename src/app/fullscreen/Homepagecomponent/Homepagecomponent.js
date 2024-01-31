'use client'
import React,{useState,useEffect} from 'react';
import '../fullscreen.css'
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
export default function Homepagecomponent() {
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
  const [symbols,setSymbols]=useState(false);
  const [numbers,setNumbers]=useState(false);
  const [islogin,setIslogin]=useState(false);
  const [specificuser,setSpecificuser]=useState({
    rank:'Not Applicable',
    netTypingSpeed:'Not Applicable'
  });
  let [contestTime,setcontestTime]=useState({
    min:'00',
    sec:'30'
  }); 
  const [correcttime,setcorrecttime]=useState(false)
  const [userdetails,setuserdetails]=useState({});
  const getrandomid=async(min,sec)=>{
    const url=process.env.NEXT_PUBLIC_BACKEND;
    const api=url+'/typingpassage';
    const payload={
      numberinclude:numbers?1:0,
      symbolinclude:symbols?1:0
    }
    let response=await fetch(api,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(payload)
    });
    response=await response.json();
    router.push(`/fullscreen/typing/${response.details}/${parseInt(min*60)+parseInt(sec)}`);
  }
  const handlestart=()=>{
    setcorrecttime(false);
    let min=contestTime.min;
    let sec=contestTime.sec;
    if(min.length==1){
      min='0'+min;
    }
    if(sec.length==1){
      sec='0'+sec;
    }
    // console.log(min,sec)
    const arr=[parseInt(min[0]),parseInt(min[1]),parseInt(sec[0]),parseInt(sec[1])]
    // console.log(arr)
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
      getrandomid(min,sec);


    }

  }
  const apifetch=async()=>{
    const url=process.env.NEXT_PUBLIC_BACKEND;
    const api=url+'/users/leaderboard';
    let response=await fetch(api);
    response=await response.json();
    // console.log(response)
    if(response.status==200){
      setuserdetails(response.details);
      // console.log(response.details)
      let storedname=localStorage.getItem('rapidkeyscredentials');
      let data,username;
      if(storedname){
        data=JSON.parse(storedname);
        username=data.username;
        setIslogin(true);
      }
      const foundUser = response.details.find((user) => Object.keys(user)[0] === username);
      if (foundUser) {
        const rank = (response.details.indexOf(foundUser) + 1).toString();
        const netTypingSpeed = (Math.floor((foundUser[username].accuracy * foundUser[username].wpm)/100)).toString();

        setSpecificuser({
          rank: rank,
          netTypingSpeed: netTypingSpeed + ' Wpm',
        });
      } else {
        // User not found, set default values
        setSpecificuser({
          rank: 'Not Applicable',
          netTypingSpeed: 'Not Applicable',
        });
      }
    }
  }
  useEffect(()=>{
    apifetch();
  },[])
  return showcontent ? (
    <div>
    { islogin &&
    <div className="fullscreenhomepage">
      <div className='fullscreenhomepageleft'>
        <Link href='https://github.com/PIYUSH-GIRI23'>
          <Image 
            className='fullscreenhomepageleftgithub'
            alt="github"
            width={50}
            height={50}
            src="/github.png"
          />
        </Link>
        <Link href='https://in.linkedin.com/in/piyush-giri-031b71254'>
          <Image 
            className='fullscreenhomepageleftlinkedin'
            alt="linkedin"
            width={50}
            height={50}
            src="/linkedin.png"
          />
        </Link>
        <Link href='https://www.instagram.com/piyush_giri23/'>
          <Image 
            className='fullscreenhomepageleftinstagram'
            alt="instagram"
            width={50}
            height={50}
            src="/instagram.png"
            />
        </Link>
          <Link href='https://twitter.com/GIRIPIYUSH2310'>
          <Image 
            className='fullscreenhomepagelefttwitter'
            alt="twitter"
            width={45}
            height={45}
            src='/x.png'
          />
          </Link>
      </div>
      <div className='fullscreenhomepagecenter'>
        <div className='fullscreenhomepagecentertop'>
          <div className='fullscreenhomepagecentertopchild'>Rank : {specificuser.rank}</div>
          <div className='fullscreenhomepagecentertopchild'>Net Typing Speed : {specificuser.netTypingSpeed}</div>
        </div>
        <div className='fullscreenhomepagecenterbottom'>
          <Image
            className='fullscreenhomepagecenterbottomimage'
            alt="homepage"
            width={220}
            height={100}
            src='/final3.png'
          />
          <div className='fullscreenhomepagecenterbottomcontestbox'>
            {/* main content here */}
            <div className='fullscreenhomepagecenterbottomcontestboxtime'>
              <input id='mininput' className='fullscreenhomepagecenterbottomcontestboxinputhr' value={contestTime.min} maxLength={2}  onChange={(e)=>setcontestTime({...contestTime,min:e.target.value})}/>
              <div className='fullscreenhomepagecenterbottomcontestboxinputcolon'>:</div>
              <input id='secinput' className='fullscreenhomepagecenterbottomcontestboxinputmin' value={contestTime.sec} maxLength={2} onChange={(e)=>setcontestTime({...contestTime,sec:e.target.value})}/>
            </div>
            <div className='fullscreenhomepagecenterbottomcontestboxtimedefault'>
              <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'01',sec:'00'})}>1 min</div>
              <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'02',sec:'00'})}>2 min</div>
              <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'05',sec:'00'})}>5 min</div>
              <div className='fullscreenhomepagecenterbottomcontestboxtimedefaultchild' onClick={(e)=>setcontestTime({...contestTime,min:'10',sec:'00'})}>10 min</div>
            </div>
            <div className='fullscreenhomepagecenterbottomcontestboxoptions'>
              {/* checkbox */}
              <div className="fullscreenhomepagecenterbottomcontestboxoptionschild">
                <div className={!symbols ? 'fullscreenhomepagecenterbottomcontestboxoptionschildcheckbox' : 'fullscreenhomepagecenterbottomcontestboxoptionschildcheckbox2'} onClick={()=>setSymbols(!symbols)}></div>
                <div className="fullscreenhomepagecenterbottomcontestboxoptionschildtext" onClick={()=>setSymbols(!symbols)}>Include Symbols</div>
              </div>
              <div className="fullscreenhomepagecenterbottomcontestboxoptionschild">
                <div className={!numbers ? 'fullscreenhomepagecenterbottomcontestboxoptionschildcheckbox' : 'fullscreenhomepagecenterbottomcontestboxoptionschildcheckbox2'} onClick={()=>setNumbers(!numbers)}></div>
                <div className="fullscreenhomepagecenterbottomcontestboxoptionschildtext" onClick={()=>setNumbers(!numbers)}>Include Numbers</div>
              </div>
            </div>
            {
              correcttime && 
              <div className='warning'>Please enter correct time</div>
            }
          </div>
          <div className='fullscreenhomepagecenterbottomconteststartbutton' onClick={handlestart}>Start</div>
        </div>
      </div>
      <div className='fullscreenhomepageright'>
        <div className='fullscreenhomepagerightheader'>Leaderboards</div>
        <hr className='hr'/>
        <div className='fullscreenhomepagerightheading'>
          <div className='fullscreenhomepagerightheadingchild'>Username</div>
          <div className='fullscreenhomepagerightheadingchild'>Accuracy</div>
          <div className='fullscreenhomepagerightheadingchild'>Wpm</div>
          <div className='fullscreenhomepagerightheadingchild'>Last Active</div>
        </div>
        <hr className='hr2'/>
        <div className='fullscreenhomepagerightcontent'>
          {
            userdetails.length>0 && userdetails.map((user,index)=>{
              return(
                // Inside your map function
                <Link className='fullscreenhomepagerightcontentgenerated' href={`/fullscreen/statistics/${Object.keys(user)[0]}`} key={Object.keys(user)[0]}>
                  <div className='fullscreenhomepagerightcontentgeneratedchild'>{Object.keys(user)[0]}</div>
                  <div className='fullscreenhomepagerightcontentgeneratedchild'>{user[Object.keys(user)[0]].accuracy}%</div>
                  <div className='fullscreenhomepagerightcontentgeneratedchild'>{user[Object.keys(user)[0]].wpm}</div>
                  <div className='fullscreenhomepagerightcontentgeneratedchild'>{user[Object.keys(user)[0]].lastactive}</div>
                </Link>

              )
            })
          }
        </div>
      </div>
    </div>}
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your PC</div>
}
