"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import '../../fullscreen.css';
import Image from 'next/image';

const Page = ({ params }) => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false)
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


  return showContent ? (
    <div className="mainparacontainer">
      <div className="mainparanavbar">
        <Image
          src="/final3.png"
          width={200}
          height={100}
          className="fullscreenredirectHomeImagelogomainpara"
          alt="home button here"
          priority={true}
        />
        <div className="closebutton">End Task</div>
      </div>
      <div className="mainbody">
        {/* {passage.passage_content} */}
        {/* {particularpassage} */}
      </div>
    </div>
  ) : (
    <div className="cantshowcontent">This website is under maintenance. <br />Please view it on your PC</div>
  );
};

export default Page;
