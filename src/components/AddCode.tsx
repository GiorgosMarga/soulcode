import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
const AddCode = ({setShowHandler}:{setShowHandler: () => void}) => {
  return (
    <div className='m-1 hover:scale-105 transition-all duration-100 ease-in w-[380px] h-[350px] rounded-3xl shadow-lg flex items-center justify-center'>
        <div className='flex items-center justify-center w-[100px] h-[100px] rounded-2xl bg-gray-700 cursor-pointer'>
            <PlusCircleIcon className=' text-red-500/70 h-16 w-16 ' onClick={setShowHandler}/>
        </div>
    </div>
  )
}

export default AddCode