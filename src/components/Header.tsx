import React, {useEffect} from 'react'
import {InboxIcon, BellAlertIcon, UserCircleIcon} from "@heroicons/react/24/outline"
import { userState } from '~/atoms/userAtom'
import {useRecoilValue} from "recoil"
import { useRouter } from 'next/router'
import Link from 'next/link'
const Header = () => {
    const id = useRecoilValue(userState) 
    const router = useRouter()
    useEffect(() => {
        console.log(id)
    },[id])

    const redirectToProfile = () => {
        router.push(`/user/${id}`).catch((err) => console.log(err))
    }
  return (
    <header className='w-[90%] h-12 px-20 m-5 rounded-3xl bg-red-500/70 absolute top-0 items-center flex text-white justify-between'>
        <div>
            <Link className='font-extrabold text-3xl' href={"/"}>soulcode</Link>
        </div>
        <div className='flex space-x-2'>
            <div className='w-8 h-8 bg-red-400 rounded-full flex items-center justify-center cursor-pointer p-1'>
                <InboxIcon className='w-7 h-7 text-white'/>
             </div>
            <div className='w-8 h-8 bg-red-400 rounded-full flex items-center justify-center cursor-pointer p-1'>
                <BellAlertIcon className='w-7 h-7 text-white'/>
            </div>
            <div className='w-8 h-8 bg-red-400 rounded-full flex items-center justify-center cursor-pointer p-1' onClick={redirectToProfile}>
                <UserCircleIcon className='w-7 h-7 text-white'/>
            </div>
        </div>
    </header>
  )
}

export default Header