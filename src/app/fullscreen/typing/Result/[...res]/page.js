"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect,useCallback } from 'react';
import '../../../fullscreen.css';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/fullscreen/Navbar/Navbar'
import Bargraph from '@/app/fullscreen/typing/Bargraph'
const Page = ({params}) => {
    const router = useRouter();
  const [showContent, setShowContent] = useState(false)
  const [islogin,setislogin] = useState(false)
  const [apifetchdata,setapifetchdata] = useState(0)
  const [userwpm, setuserwpm] = useState(0)
  const [useraccuracy, setuseraccuracy] = useState(0)
  const [usermistake, setusermistake] = useState(0)
  const [usercharcount, setusercharcount] = useState(0)
  const [usertime, setusertime] = useState(0)
  const [modal,setmodal]=useState(false);
  const [barwpm,setbarwpm]=useState([]);
  const [baraccuracy,setbaraccuracy]=useState([]);
  const [correcttime,setcorrecttime]=useState(false);
  const [usergrosswpm, setusergrosswpm] = useState(0)
  const [rank,setrank]=useState(0);
  let [contestTime,setcontestTime]=useState({
    min:'00',
    sec:'30'
  }); 
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
      router.push(`/fullscreen/typing/${params.res[0]}/${(timemin) +timesec}`);
    }
  }
    useEffect(() => {
      const token=localStorage.getItem('rapidkeyscredentials');
      if(token){
          setislogin(true)
    }})
    useEffect(()=>{
      const apifetch=async()=>{
        const token=JSON.parse(localStorage.getItem('rapidkeyscredentials'));
        let url=process.env.NEXT_PUBLIC_BACKEND;
        let api=url+'/passage/resultpassage/';
        let res=await fetch(api,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            logintoken:token.logintoken

          },
          body:JSON.stringify({
            username:token.username, //change it later
            passageid:parseInt(params.res[0])
          })
        })
        res=await res.json();
        if(res.status===200){
          const {details}=res;
          console.log(details)
          setapifetchdata(details);
        }

      }
      apifetch();
    },[])
    useEffect(()=>{
        const token=localStorage.getItem('rapidkeyscredentials');
        if(!token) return;
        let time=localStorage.getItem('time');
        if(time===0){
          setuseraccuracy(0);
          setuserwpm(0);
          setusermistake(0);
          setusercharcount(0);
          setusertime(0);
          setusergrosswpm(0);
          return;
        }
        let totalwpm;
        if(time<60 && time>0 ){
            totalwpm=localStorage.getItem('wordcounter')*(Math.ceil(60/parseInt(time)))
        }
        else if(time>=60 && time>0){
            totalwpm=Math.floor(localStorage.getItem('wordcounter')/(Math.ceil(parseInt(time)/60)))
            // console.log(time,totalwpm,Math.ceil(parseInt(time)/60))
        }
        console.log(totalwpm)
        if(time>0)setuserwpm(totalwpm)
        const accuracy=(localStorage.getItem('charcounter')-localStorage.getItem('mistake'))
        setuseraccuracy((accuracy===0)?0:((accuracy*100/localStorage.getItem('charcounter')).toFixed(2)))
        setusercharcount(localStorage.getItem('charcounter'))
        setusermistake(localStorage.getItem('mistake'))
        setusertime(localStorage.getItem('time'))
        if (accuracy===0){
          setusergrosswpm(0)
        }
        else{
          setusergrosswpm(Math.floor((totalwpm*(accuracy*100/localStorage.getItem('charcounter'))/100)))
        }
    },[])
    const apifetch=async()=>{
      const url=process.env.NEXT_PUBLIC_BACKEND;
      const api=url+'/users/leaderboard';
      let response=await fetch(api);
      response=await response.json();
      // console.log(response)
      if(response.status==200){
        let storedname=localStorage.getItem('rapidkeyscredentials');
        let data,username;
        if(storedname){
          data=JSON.parse(storedname);
          username=data.username;
          setislogin(true);
        }
        const foundUser = response.details.find((user) => Object.keys(user)[0] === username);
        if (foundUser) {
          const rank = (response.details.indexOf(foundUser) + 1).toString();
          setrank(rank);
        }
      }
    }
    useEffect(()=>{
      apifetch();
    },[])
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      setShowContent(viewportWidth > 1000);
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
  useEffect(()=>{
    const currentDate = new Date();
    const formattedDate = currentDate.getDate()
    const obj=[
      {
        id:1,
        date:apifetchdata.lastactive,
        data:apifetchdata.maxwpm,
      },
      {
        id:2,
        date:formattedDate,
        data:userwpm
      },
    ]
    const obj2=[
      {
        id:1,
        date:apifetchdata.lastactive,
        data:apifetchdata.maxaccuracy,
      },
      {
        id:2,
        date:formattedDate,
        data:useraccuracy
      },
    ]
    setbarwpm(obj);
    setbaraccuracy(obj2);
  },[apifetchdata])
  return showContent ?(
    <div>
      { islogin && <Navbar />}
      <div className={modal?"fullscreentestmodal fullscreentestmodaladvance":"fullscreentestmodal2"}>
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
      {islogin && <div className={!modal?"typingresultcontainer":"typingresultcontainer2"}>
        <div className='typingresultleft'>
            <div className='typingresultleftchild'>Global Rank : {rank}</div> 
            <div className='typingresultleftchild'>Wpm : {userwpm}</div>
            <div className='typingresultleftchild'>Accuracy : {useraccuracy}%</div>
            <div className='typingresultleftchild'>Gross Wpm : {usergrosswpm}</div>
            <div className='typingresultleftchild'>Total Characters : {usercharcount}</div>
            <div className='typingresultleftchild'>Correct Characters : {usercharcount-usermistake}</div>
            <div className='typingresultleftchild'>Time Taken : {Math.floor(usertime/60)}m {usertime%60}s</div>
        </div>
        
        <div className='typingresultright'>
            <div className='typingresultrighttop'>
                <Link className="typingresultrighttophomebutton" href="/">
                    <Image
                        src="/home.png"
                        alt="Picture of the author"
                        width={50}
                        height={50}
                    />
                </Link>
                <div className='typingresultrighttopgraph'>
                    {/* graph */}
                    <Bargraph chartData={barwpm} whichclass="chart-containerbar1" title="Wpm" label="last active vs wpm"/>
                    <Bargraph chartData={baraccuracy} whichclass="chart-containerbar2" title="Accuracy" label="last active vs accuracy"/>
                </div>
            </div>
            <div className='typingresutrightbottom'>
                <div className='typingresultrightchild'>Passage Id : {params.res[0]}</div>
                <div className='typingresultrightchild'>Total no of attempts : {apifetchdata.totalattempt}</div>
                <Link className='typingresultrightchild typingresultrightbottombutton' href={`/fullscreen/statistics/passage/${params.res[0]}`}>Passage Details</Link>
                <div className='typingresultrightchild typingresultrightbottombutton' onClick={()=>setmodal(!modal)}>Take Test again</div>
            </div>
        </div>
      </div> }
      {!islogin && <div className='warning'>Please Login to view this page</div>}
    </div>
  ):(
    <div className="cantshowcontent">This website is under maintenance. <br />Please view it on your PC</div>
  );
}

export default Page
