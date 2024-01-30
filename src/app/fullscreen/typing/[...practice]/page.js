"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import '../../fullscreen.css';
import Image from 'next/image';

const Page = ({ params }) => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false)
  const [passage, setpassage] = useState([])
  const [donotreload, setDonotreload] = useState(false)
  const [whichpassage,setwhichpassage]  = useState(0)
  const [particularpassage,setparticularpassage] = useState([])

  const [charcounter, setCharcounter] = useState(0)
  const [wordcounter, setWordcounter] = useState(0)
  const [rowcounter, setRowcounter] = useState(0)
  const [mistake, setMistake] = useState(0)
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

  useEffect(() => {
    const apiFetch = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND;
      const apiurl = url + '/typingpassage/' + params.practice[0];
      let res = await fetch(apiurl);
      let data = await res.json();
      if (data.status === 200) {
        const passage=data.details.passage_content
        // console.log(data)
        let result = passage.map(word => word.split('').map(char => char !== ' ' ? [char] : [' ']));
        // console.log(result)
        setpassage(result);
        // sessionStorage.setItem('mistake',0);
        // sessionStorage.setItem('charcounter',0); // columncounter
        // sessionStorage.setItem('wordcounter',0);
        // sessionStorage.setItem('rowcounter',0);
      }
    };
    apiFetch();
  }, [donotreload]);
  const handleKeyDown=()=>{
    // const allowedKeys = /^[0-9a-zA-Z*&^%$#@!\b]+$/;
    const excludedKeys = /^(Control|Shift|Alt|F\d+|Tab|CapsLock|ScrollLock|NumLock|Enter|Insert|Delete|PrintScreen|Escape)$/;
    if(!excludedKeys.test(e.key)){
      console.log("allowed")
      // if (e.key === 'Shift' || e.key === 'Control') {
      //   return;
      // }
      if(e.key==='Backscape'){
        if((passage[rowcounter][charcounter]===" ") || (passage[rowcounter][charcounter-1] === " ") || (charcounter==0)){
          // console.log(3)
        }
        else{
          setCharcounter(charcounter-1);
          let character=passage[rowcounter][charcounter];
          character=character.classList.add('highlight');
          let result=passage;
          result[rowcounter][charcounter]=character;
          setpassage(result);
        }
      }
      else{
          console.log(rowcounter,charcounter)
          let character=passage[rowcounter][charcounter];
          character=character.classList.add('highlight');
          let result=passage;
          result[rowcounter][charcounter]=character;
          setpassage(result);
          if(e.key !== passage[rowcounter][charcounter]){
          setMistake(mistake+1);
          // change color of the word
          if(passage[rowcounter][charcounter]===" ");
          else{
            let character=passage[rowcounter][charcounter];
            character=character.classList.add('mainbodywrong');
            let result=passage;
            result[rowcounter][charcounter]=character;
            setpassage(result);
          }
        }
        if (e.key==" " && passage[rowcounter][charcounter] === " ") setWordcounter(wordcounter+1);
        if(!passage[rowcounter][charcounter+1]){
          setWordcounter(wordcounter+1);
          if(!passage[rowcounter][charcounter+2]){
            // submit the test .. no further paragraph
          }
          else{
            setRowcounter(rowcounter+1);
            setCharcounter(-1)
            setwhichpassage(whichpassage)
          }
        } 
        setCharcounter(charcounter+1);
      }
    }
    else return;
  }
  useEffect(()=>{
    const getpassage=()=>{
      let result=passage;
      console.log(result);
      setparticularpassage(passage[whichpassage])
    }
    getpassage();
  },[whichpassage,passage])
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [passage]);
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
        {particularpassage}
      </div>
    </div>
  ) : (
    <div className="cantshowcontent">This website is under maintenance. <br />Please view it on your PC</div>
  );
};

export default Page;
