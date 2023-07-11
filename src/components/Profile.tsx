import React from 'react'

const Profile = () => {
  return (
    <div className='flex-col flex  h-[100%] w-[30%] rounded-l-3xl  border-black'>
      <div className='h-[40%] flex items-center justify-center border-b border-black rounded-br-xl border-r'>
        <div className='bg-red-500 h-28 w-28 rounded-full'/>
      </div>
      <div className='h-[60%] w-[100%] border-r border-black rounded-tr-xl text-red-500/70 items-start p-10 space-y-2 flex flex-col font-semibold'>
        <p>Gender: Male</p>
        <p>Age: 21</p>
        <p>Language: Go</p>
        <p>Portfolio: www.test.com</p>
      </div>
    </div>
  )
}

export default Profile