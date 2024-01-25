import React from 'react'
import "../../../fullscreen.css"
import Navbar from '@/app/fullscreen/Navbar/navbar'
const page = ({params}) => {
  return (
    <div className="fullscreenspecificpassage">
      <Navbar/>
      <br/> 
      {params.passage}
    </div>
  )
}

export default page
