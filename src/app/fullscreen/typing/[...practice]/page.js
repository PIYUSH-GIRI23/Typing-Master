import { useRouter } from 'next/navigation'
import React from 'react'

const page = ({params}) => {
  const router=useRouter();
  // console.log({params})
  // console.log("wordls")
  return (
    <div>
      {/* {params.word} */}
      {params.practice[0]}
      {params.practice[1]}
    </div>
  )
}

export default page
