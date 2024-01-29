"use client"
import React,{useEffect,useState} from 'react'
import Navbar from '@/app/fullscreen/Navbar/navbar'
import { useRouter } from 'next/navigation'
const page = ({params}) => {
  const router = useRouter();
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
  const [passagefound,setpassagefound] = useState(false)
  const[islogin,setislogin] = useState(false)
  const [passage,setPassage] = useState({})
  const getpassage=async()=>{
    const token=localStorage.getItem('rapidkeyscredentials')
    if(!token){
      setislogin(false)
      return;
    }
    else setislogin(true)
    const url=process.env.NEXT_PUBLIC_BACKEND
    const api=url+'/typingpassage/'+params.para
    const res=await fetch(api)
    if(res.status==200){
      const data=await res.json()
      setPassage(data.details);
      // setpassagefound(!true); 
    }
    else if(res.status==404){
      setpassagefound(!false);
      return;
    }
    // console.log(data.details)
  }
  useEffect(()=>{
    getpassage()
  },[])
  const renderColoredParagraphs = () => {
    if (passage.passage_content) {
      return passage.passage_content.map((paragraph, index) => {
        const colors = ['rgba(245, 245, 220, 1)', 'rgba(144, 238, 144, 1)', 'rgba(230, 230, 250, 1)'];
        const color = colors[index % colors.length]; // Cycle through colors

        return (
          <div key={index} style={{ color }}>
            {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}<br /><br/>
          </div>
        );
      });
    }
    return null;
  };
  return showcontent ?(
    <div className='fullscreenshowpara'>
      <Navbar/>
    {islogin && !passagefound && <div className="fullscreenshowparacontainer">
        {/* <h2>{params.para}</h2> */}
          <div className='fullscreenshowparacontainerheading'>
            Passage Id : {passage.passage_id}
          </div>
          <div className='fullscreenshowparacontainerbody'>
            {/* {(passage.passage_content).map((item,index)=>(
              <div key={index}>
                {item}
              </div>
            ))} */}
            {renderColoredParagraphs()}
          </div>
          <div className='fullscreenshowparacontainerfooter'>
            Total Words : {passage.passage_words}
          </div>
        </div>}
        {!islogin && (
        <div className='warning'>
          Please login to continue
          {/* {localStorage.removeItem('rapidkeyscredentials')}
          {router.push('/fullscreen/login')} */}
        </div>
      )}
      {passagefound && (
        <div className='warning'>
          Passage not found
          {localStorage.removeItem('rapidkeyscredentials')}
          {router.push('/fullscreen/login')}
        </div>
      )}
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>
}

export default page
