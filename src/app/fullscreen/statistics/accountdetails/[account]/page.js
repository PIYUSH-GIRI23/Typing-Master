"use client"
import React,{useState,useEffect} from 'react'
import "../../../fullscreen.css"
import Link from 'next/link'
import Navbar from '@/app/fullscreen/Navbar/navbar'
import Linechart from "../../Linechart";
import { useRouter } from 'next/navigation'
const page = ({params}) => {
  const router=useRouter();
  const [isnotlogin,setisnotlogin]=useState(false);
  const [usernotfound,setUsernotfound]=useState(false);

  const [deletemodal,setdeletemodal]=useState(false);
  const [resetmodal,setresetmodal]=useState(false);
  const [updatemodal,setupdatemodal]=useState(false);

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
      console.log(details)
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
  return (
    <div className="fullscreenaccount">
        <Navbar/>
          {isnotlogin && 
          <div className="fullscreenaccountnotlogin">
            Please Login to view your account details
            {setTimeout(() => {
              localStorage.removeItem("rapidkeyscredentials");
              router.push("/fullscreen/login");
            }, 1200)}
          </div>
        }
        {usernotfound && <div className="fullscreenusernotfound">
            <h1>User Not Found</h1>
            {setTimeout(() => {
              localStorage.removeItem("rapidkeyscredentials");
              router.push("/fullscreen/login");
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
                  redirect to login page
                */}
              <div className='fullscreenaccountaccountrightsidebottom'>
                <div className="fullscreenrightaccountchildbutton" name="maxwpm">
                  <div className="fullscreenrightsidetopupdate" name="name">Update</div>
                  <div className="fullscreenrightsidetopdelete" name="delete">Delete</div>
                  <div className="fullscreenrightsidetopreset" name="reset">Reset</div>
                  {/* update a/c delete a/c and delete all past activities
                  modal open
                  redirect to login page
                  */}
                  </div>
              </div>
            </div>
        </div>}
    </div>
  )
}

export default page