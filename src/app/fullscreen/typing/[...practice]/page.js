"use client"
import { useRouter } from 'next/navigation';
import React, { useState, useEffect,useCallback } from 'react';
import '../../fullscreen.css';
import Image from 'next/image';

const Page = ({ params }) => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false)
  const [passage, setpassage] = useState([])
  const [donotreload, setDonotreload] = useState(false)
  const [whichpassage,setwhichpassage]  = useState(0)
  const [particularpassage,setparticularpassage] = useState([])
  const [keypressed,setkeypressed] = useState('')
  const [passage_length,setpassagelength] = useState(0)

  const [charcounter, setCharcounter] = useState(0)
  const [colcounter, setColcounter] = useState(0)
  const [wordcounter, setWordcounter] = useState(0)
  const [clock,setclock] = useState(params.practice[1])
  // const [stopwatch,setstopwatch]=useState(0) // to get exact cout while api posting
  // const [rowcounter, setRowcounter] = useState(0)
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
    const countdownInterval = setInterval(() => {
      setclock((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);
  useEffect(() => {
    if (clock === 0) {
      // setstopwatch(params.practice[1]-clock);
      handlesubmit();
    }
  }, [clock]);
  useEffect(() => {
    const apiFetch = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND;
      const apiurl = url + '/typingpassage/' + params.practice[0];
      let res = await fetch(apiurl);
      let data = await res.json();
      if (data.status === 200) {
         setpassagelength(data.details.passage_length)
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
    }
    apiFetch();
  }, [donotreload]);
  const senddata=async()=>{
    let url=process.env.NEXT_PUBLIC_BACKEND;
    let api=url+'/passage';
    // console.log(api)
    let totalwpm;
    const time=parseInt(parseInt(params.practice[1])-clock); 
    // console.log(time);
    if (time==0) totalwpm=0;
    else if(time<60 && time>0 ){
      totalwpm=wordcounter*(Math.ceil(60/parseInt(time)))
    }
    else if(time>=60 && time>0){
      totalwpm=wordcounter/(Math.ceil(parseInt(time)/60))
      // console.log(time,totalwpm,Math.ceil(parseInt(time)/60))
    }
    let netaccuracy;
    if(localStorage.getItem('charcounter')===0) netaccuracy=0;
    const token=JSON.parse(localStorage.getItem('rapidkeyscredentials'));
    let res=await fetch(api,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        logintoken:token.logintoken
      },
      body:JSON.stringify({
        username:token.username,
        passageid:parseInt(params.practice[0]),
        wpm:totalwpm,
        accuracy:(netaccuracy===0)?0:(((localStorage.getItem('charcounter')-localStorage.getItem('mistake'))/localStorage.getItem('charcounter')))*100
      })
    })
    res=await res.json();
    // console.log(res)
    if(res.status===200) return 1;
    else return 0;
  }
  const handlesubmit = async() => {
    // console.log(mistake);
    // console.log(charcounter);
    // console.log(wordcounter);
    // console.log(whichpassage);
    // setstopwatch(params.practice[1]-clock);
    localStorage.setItem('mistake',mistake);
    localStorage.setItem('charcounter',(charcounter==0)?colcounter:((colcounter==0)?charcounter:charcounter+colcounter)); // columncounter
    localStorage.setItem('wordcounter',wordcounter);
    localStorage.setItem('time',params.practice[1]-clock); // replace it with actual time may be user end before
    const a = await senddata();
    console.log(a)
    if(a===0){
      setShowContent(true);
      return;
    }
    // else console.log("all fine..u can proceed")
    router.push('/fullscreen/typing/Result/'+params.practice[0]);
  }
  useEffect(() => {
    const showuserpassage=()=>{
      setparticularpassage(passage[whichpassage])
    }
    showuserpassage()
  },[passage,whichpassage])
  const handleKeyDown = (e) => {
    const excludedKeys = /^(Control|Shift|Alt|F\d+|Tab|CapsLock|ScrollLock|NumLock|Enter|Insert|Delete|PrintScreen|Escape)$/;
    if (excludedKeys.test(e.key)) return;
    if(e.key === "Backspace") return;
    if(!particularpassage[colcounter+1]){
      setCharcounter(charcounter+colcounter);
      if(whichpassage === passage_length-1){
        nowitsok();
        return;
      }
      setColcounter(-1);
      setWordcounter(prevWordcounter => prevWordcounter + 1);
      setwhichpassage((prevwhichpassage) => prevwhichpassage + 1);
    }
    // add cursor
    
    if (e.key === particularpassage[colcounter][0]) {
      let newele = ( 
        <span className="mainbodyactive">
          {e.key === " " ? '\u00A0' : e.key}
        </span>
      );
  
      let result = [...particularpassage];
      result[colcounter] = newele;
  
      setparticularpassage(result);
      setColcounter((prevColcounter) => prevColcounter + 1);
    } 
    else {
      setMistake((prevMistake) => prevMistake + 1);
      let result = [...particularpassage];
      if(result[colcounter][0] !== " "){
        let newele = (
          <span className="mainbodywrong">
            { result[colcounter][0]}
          </span>
        );
    
        result[colcounter] = newele;
    
        setparticularpassage(result);
        setColcounter((prevColcounter) => prevColcounter + 1);
      }
      else{
        let newele = (
          <span className="mainbodywrong" >
             {e.key}
          </span>
        );
    
        result[colcounter] = newele;
    
        setparticularpassage(result);
        setColcounter((prevColcounter) => prevColcounter + 1);
      }
    }
    // console.log(particularpassage)
    if(particularpassage[colcounter][0] === " "){
      setWordcounter((prevWordcounter) => prevWordcounter + 1);
    }
  };
  
  const nowitsok=()=>{}
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Cleanup: remove the event listener when the component unmounts
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
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
        <div className="closebutton" onClick={handlesubmit}>End Task</div>
      </div>
      <dic className="counter">{clock}</dic>
      <div className="mainbody">
      {particularpassage && particularpassage.map((char, index) => (
  <span key={index}>
    {index === colcounter && index < particularpassage.length - 1 && <span className="cursor">|</span>}
    {char}
  </span>
))}

      </div>
    </div>
  ) : (
    <div className="cantshowcontent">This website is under maintenance. <br />Please view it on your PC</div>
  );
};

export default Page;
