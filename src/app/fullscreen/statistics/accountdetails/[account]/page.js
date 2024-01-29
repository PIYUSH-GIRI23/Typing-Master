"use client"
import React,{useState,useEffect} from 'react'
import "../../../fullscreen.css"
import Link from 'next/link'
import Navbar from '@/app/fullscreen/Navbar/Navbar'
import Linechart from "../../Linechart";
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
  const [isnotlogin,setisnotlogin]=useState(false);
  const [usernotfound,setUsernotfound]=useState(false);

  const  [userdetails,setUserdetails]=useState({});
  const [chartData, setChartData] = useState([]);
  let url=process.env.NEXT_PUBLIC_BACKEND;
  async function getuserdetails(){
    const username=params.account;
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
  useEffect(()=>{
    const data=localStorage.getItem("rapidkeyscredentials");
    const storedData = JSON.parse(data);
    if(storedData && storedData.logintoken && storedData.username){ 
      setisnotlogin(false);
    }
    else setisnotlogin(true);
  },[])
  const handledelete=()=>{
    console.log("clicked")
  }
  return showcontent ?(
    <div className="fullscreenaccount">
        <Navbar/>
          {isnotlogin && 
          <div className="fullscreenaccountnotlogin">
            Please Login to view your account details
            {setTimeout(() => {
              localStorage.removeItem("rapidkeyscredentials");
              router.push("/fullscreen/Login");
            }, 1200)}
          </div>
        }
        {usernotfound && <div className="fullscreenusernotfound">
            <h1>User Not Found</h1>
            {setTimeout(() => {
              localStorage.removeItem("rapidkeyscredentials");
              router.push("/fullscreen/Login");
            }, 1200)}
          </div>
        }
        {!isnotlogin && 
        <div className="fullscreenaccountdetails">
            <div className="fullscreenaccountaccountleftside">
              <div className='fullscreenaccountaccountleftsidetop'>
                <div className="fullscreenrightaccountchild" name="name">
                  Name : {userdetails.name}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="username">
                  Username : {userdetails.username}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="emailid">
                  Email Id : {userdetails.email}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="maxwpm">
                  Date joined :{userdetails.createdAt}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="maxaccuracy">
                  Total passages : {userdetails.totalpassages}
                </div>
              </div>
              <hr className="hr"/>
              <div className='fullscreenaccountaccountleftsidebottom'>
                {/* max wpm,max accuracy , total attempt/test , graph(chota sa) in form of buttons*/}
                <div className="fullscreenrightaccountchild" name="name">
                  Max Wpm : {userdetails.maxwpm}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="username">
                  Max accuracy : {userdetails.maxaccuracy}
                </div>
                <hr className="hr2"/>
                <div className="fullscreenrightaccountchild" name="emailid">
                  Total attempt : {userdetails.totalattempt}
                </div>
              </div>
            </div>
            <div className="fullscreenaccountaccountrightside">
              <div className='fullscreenaccountaccountrightsidetop'>
                  <div className="fullscreenaccountaccountrightsidetopupper">
                    <div className="fullscreenrightaccountchildparent" name="passage">
                      <div className="fullscreenrightaccountchildname">Passage Id</div>
                      <div className="fullscreenrightaccountchildname">Attempt</div>
                      <div className="fullscreenrightaccountchildname">Max accuracy</div>
                      <div className="fullscreenrightaccountchildname">Max Wpm</div>
                      <div className="fullscreenrightaccountchildname">Avg accuracy</div>
                      <div className="fullscreenrightaccountchildname">Avg Wpm</div>
                  </div>
                  <hr className='hr2'/>
                <div className='fullscreenrightaccountchildgenerated' name="passage">
                {userdetails.passagelist && Object.entries(userdetails.passagelist).map(([passageId, passageDetails]) => (
                  <Link className='fullscreenrightaccountchildgeneratedinner' key={passageId}  href={`/fullscreen/statistics/passage/${passageId}`}>
                    <div className="fullscreenrightaccountchildname2">{passageId}</div>
                    <div className="fullscreenrightaccountchildname2">{passageDetails.attempts}</div>
                    <div className="fullscreenrightaccountchildname2">{passageDetails.avegareaccuracy}%</div> 
                    <div className="fullscreenrightaccountchildname2">{passageDetails.averagewpm}</div>
                    <div className="fullscreenrightaccountchildname2">{passageDetails.maxaccuracy}%</div>
                    <div className="fullscreenrightaccountchildname2">{passageDetails.maxwpm}</div>
                  </Link>
                ))}
                </div>
                  </div>
                  <div className="fullscreenaccountaccountrightsidetoplower">
                    <Linechart chartData={chartData} whichclass="chart-container-account"/>
                  </div>
                </div>{/* update a/c delete a/c and delete all past activities
                  modal open
                  redirect to login Page
                */}
              <div className='fullscreenaccountaccountrightsidebottom'>
                <div className="fullscreenrightaccountchildbutton" name="maxwpm">
                  <Link className="fullscreenrightsidetopupdate" name="name" href="/fullscreen/modify/Update">Update</Link>
                  <Link className="fullscreenrightsidetopdelete" name="delete" href="/fullscreen/modify/Delete">Delete</Link>
                  <Link className="fullscreenrightsidetopreset" name="reset" href="/fullscreen/modify/Reset">Reset</Link>
                  {/* update a/c delete a/c and delete all past activities
                  modal open
                  redirect to login Page
                  */}
                  </div>
              </div>
            </div>
        </div>}
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>

}

export default Page
