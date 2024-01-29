"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState,useEffect } from 'react'
import '../../fullscreen.css'

const page = ({params}) => {
  const router=useRouter();
  // console.log({params})
  // console.log("wordls")
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
  return showcontent ?(
    <div>
      {/* {params.word} */}
      {params.practice[0]}
      {params.practice[1]}
    </div>
  ):<div className='cantshowcontent'>This website is under maintainence. <br/>Please view it on your pc</div>
}

export default page
