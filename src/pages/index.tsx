/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Head from "next/head";
import CodeCard from "~/components/CodeCard";
import Header from "~/components/Header";
import {useState, useEffect} from "react"
import { api } from "~/utils/api";
import { useRecoilState } from "recoil";
import { userState } from "~/atoms/userAtom";
import { useRouter } from "next/router";
const TAKE = 20

export default function Home() {
  
  const [userId,setUserId] = useRecoilState(userState)
  const [codeIndex,setCodeIndex] = useState(0)
  const [fetchIndex,setFetchIndex] = useState(0) 
  const user = api.auth.whoIs.useQuery()
  const codes = api.code.getCodes.useQuery({skip: fetchIndex * TAKE,take: TAKE},{staleTime: Infinity, refetchOnMount: false, retryOnMount: false,retry: false})
  const router = useRouter()


  useEffect(() => {
    if(user && user.data){
        setUserId(user.data.id)
    }
    if(user && user.error) {
      router.push("/auth").catch((err) => console.log(err))
    }
  }, [user,setUserId,router])
  

  const onChangeContent = () => {
    setCodeIndex((prevState => {
      return prevState + 1
    }))
    if(codes.data){
      // for dev only , remove on production
      if(codeIndex === codes.data.codes.length - 1) {
          console.log("here")
          setFetchIndex(prevState => prevState+=1)
          setCodeIndex(0)
      }
    }
    
  }
  return (
    <>
      <Head>
        <title>Soulcode</title>
        <meta name="description" content="Find your soulmate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="background">
        <Header/>
        {codes.data && codes.data.codes.map((code,index) => <CodeCard codeId={code.id} keyIndex={index} index={codeIndex} key={index} code={code.content} username={code.user.username} onChangeContent={onChangeContent}/>)}
        {(codes.data && codes.data.codes.length === 0) && <CodeCard codeId={'0'} keyIndex={0} index={0} key={0} code={"// You have seen all. Congrats"} username={"System"} onChangeContent={onChangeContent}/>}
      </main>
    </>
  );
}
