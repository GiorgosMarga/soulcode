import Head from "next/head";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { userState } from "~/atoms/userAtom";
import {useRecoilValue} from "recoil"
import Header from "~/components/Header";
import Profile from "~/components/Profile";
import Collection from "~/components/Collection";
import CreateCode from "~/components/CreateCode";


export default function Home() {
  const [isOpen,setIsOpen] = useState(false)
  const setShowHandler = () => {
    setIsOpen(prevState => !prevState)
  }
    const id = useRecoilValue(userState) 
    useEffect(() => {
        console.log(id)
    },[id])
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Login/Register to soulcode" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0d0d0d] to-[#0b0c17]">
            <Header/> 
            <div className="flex w-[85%] h-[85%]  rounded-2xl shadow-2xl shadow-black mt-5">
                <Profile/>
                <Collection setShowHandler={setShowHandler}/>
            </div>
            <CreateCode show={isOpen} setShow={setShowHandler}/>
      </main>
    </>
  );
}
