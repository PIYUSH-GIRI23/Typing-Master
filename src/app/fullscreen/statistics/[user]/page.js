"use client"
import React,{useState,useEffect} from 'react'
import Navbar from "../../Navbar/Navbar";
import '../../fullscreen.css'
import Linechart from "../Linechart";
import { useRouter } from 'next/navigation'
import Link from 'next/link';
const page =({params}) => {
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
  const  [userdetails,setUserdetails]=useState({});
  const [usernotfound,setUsernotfound]=useState(false);
  const [chartData, setChartData] = useState([]);
  let url=process.env.NEXT_PUBLIC_BACKEND;
  async function getuserdetails(){
    const username=params.user;
    // console.log(username)
    const apifetch=`${url}/view/userdetails/${username}`
    let res=await fetch(apifetch);
    res=await res.json();
    if(res.status===200){
      setUsernotfound(false);
      let {details,extra}=res;
      setUserdetails(details);
      // console.log(details)
    }
    else{
      setUsernotfound(true);
      return;
    }
  }
  useEffect(()=>{
    getuserdetails();
  },[params.user]) 
  useEffect(() => {
    // console.log(userdetails.datewise)
    if (userdetails.datewise) {
      let temp = [];
      Object.entries(userdetails.datewise).map(([key, data]) => {
        temp.push({
          date: key,
          accuracy: data.maxaccuracy,
          wpm: data.maxwpm,
        });
      }
      );
      setChartData(temp);
    }
    // console.log(chartData)
  }, [userdetails.datewise]);

  return  showcontent ?(
    <div className="fullscreenStatistics">
      <Navbar/>
      { localStorage.getItem("rapidkeyscredentials") && !usernotfound && <div className="fullscreenuserdetails">
        <div className="fullscreenleftside">
          <div className="fullscreenlefttop">
            <Linechart chartData={chartData} whichclass="chart-container" />
          </div>
          <div className="fullscreenleftbottom">
            <div className="fullscreenrightdetailschild" name="name">
              Name : {userdetails.name}
            </div>
            <hr className="hr2"/>
            <div className="fullscreenrightdetailschild" name="username">
              Username : {userdetails.username}
            </div>
            <hr className="hr2"/>
            <div className="fullscreenrightdetailschild" name="emailid">
              Email Id : {userdetails.email}
            </div>
            <hr className="hr2"/>
            <div className="fullscreenrightdetailschild" name="maxwpm">
              Max Wpm : {userdetails.maxwpm}
            </div>
            <hr className="hr2"/>
            <div className="fullscreenrightdetailschild" name="maxaccuracy">
              Max Accuracy : {userdetails.maxaccuracy}
            </div>
          </div>
        </div>
        <div className="fullscreenrightside">
            <div className='fullscreenrightpassagechild' name="passage">
              <div className="fullscreenrightpassagechildname">Passage Id</div>
              <div className="fullscreenrightpassagechildname">Max Accuracy</div>
              <div className="fullscreenrightpassagechildname">Max Wpm</div>
            </div>
            <div className='fullscreenrightpassagechildgenerated' name="passage">
            {userdetails.passagelist && Object.entries(userdetails.passagelist).map(([passageId, passageDetails]) => (
              <Link className='fullscreenrightpassagechildgeneratedinner' key={passageId}  href={`/fullscreen/statistics/passage/${passageId}`}>
                <div className="fullscreenrightpassagechildname2">{passageId}</div>
                <div className="fullscreenrightpassagechildname2">{passageDetails.maxaccuracy}%</div>
                <div className="fullscreenrightpassagechildname2">{passageDetails.maxwpm}</div>
              </Link>
            ))}
            </div>
          </div>
      </div>}
      {usernotfound && <div className="fullscreenusernotfound">
        <h1>User Not Found</h1>
        {setTimeout(() => {
          localStorage.removeItem("typingmastercredentials");
          router.push("/fullscreen/Login");
        }, 1200)}
      </div>
      }
      </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>

}

export default page
