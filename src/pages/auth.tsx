import Head from "next/head";
import { useEffect, useState } from "react";
import { userState } from "~/atoms/userAtom";
import {useRecoilState} from "recoil"
import { api } from "~/utils/api";
import { useRouter } from "next/router";



enum State {
    LOGIN,
    REGISTER
    
}
export default function Home() {
  const [state,setState] = useState<State>(State.LOGIN)
  const [email,setEmail] = useState("")
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [confPassword,setConfPassword] = useState("")
  const [error,setError] = useState<string>()
  const [userId,setUserId] = useRecoilState(userState)
  const router = useRouter()
  const login = api.auth.login.useMutation()
  const register = api.auth.register.useMutation()

    useEffect(() => {
        if(login.data && login.data.user.id) {
            setUserId(login.data.user.id)
            router.push("/").catch(err=> console.log(err))
        }
        if(register.data && register.data.id) {
            setUserId(register.data.id)
            router.push("/").catch(err=> console.log(err))


        }
    },[login,register,setUserId])


    const onLoginHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if(email.length !== 0 && password.length !== 0) {
            login.mutate({email,password})
        }
    }
    const onRegisterHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setError("")
        if(password !== confPassword){
            return setError("Passwords don't match.")
        }
        if(email.length !== 0 && password.length !== 0 && password === confPassword && username.length !== 0) {
            register.mutate({email,password,username})
        }
    }

    

  return (
    <>
      <Head>
        <title>Auth</title>
        <meta name="description" content="Login/Register to soulcode" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0d0d0d] to-[#0b0c17]">
        <form className="flex w-[50%] h-[50%]  bg-red-500/70  rounded-xl shadow-lg  shadow-red-950 min-w-[400px]">
            {state === State.LOGIN &&
            <div className=" flex h-full w-full items-center p-10">

                <div className="flex flex-col m-5 lg:w-[50%] w-[100%]">
                {login.error && <p className="text-center mb-5 text-white font-bold text-sm">{login.error.message}</p>}

                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md placeholder:text-white/50" placeholder="Email"/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md mt-3 placeholder:text-white/50" placeholder="Password" type="password"/>
                    <p className="text-sm text-red-200/70 mt-3 cursor-pointer hover:text-white" onClick={() => setState(State.REGISTER)}>Dont have an account? Register</p>
                    <button className="text-white text-lg font-bold px-5 mt-5 self-center py-1 hover:scale-105 hover:bg-white hover:rounded-lg hover:text-red-500 w-fit h-fit" onClick={(e) => {onLoginHandler(e)}}>Login</button>
                </div>
                <div className="w-[50%] hidden h-[100%]  font-semibold items-center justify-center lg:flex text-white/90  ">
                    <h1 className=" w-full text-center text-5xl font-extrabold ">Welcome, <p className="animate-pulse duration-150 ">developer!</p></h1>
                </div>
            </div> 
            }
            {state === State.REGISTER && <div className=" flex h-full w-full items-center p-10">
                
                <div className="w-[50%] hidden lg:flex h-[100%]  font-semibold items-center justify-center  text-white/90  ">
                    <h1 className=" w-full text-center text-5xl font-extrabold ">Join now!</h1>
                </div>
                <div className="flex flex-col m-5 w-[100%] lg:w-[50%]">
                    {register.error && <p className="text-center mb-5 text-white font-bold text-sm">{register.error.message}</p>}
                    {error && <p className="text-center mb-5 text-white font-bold text-sm">{error}</p>}

                    <input value={username} onChange={(e) => setUsername(e.target.value)}className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md placeholder:text-white/50" placeholder="Username"/>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md mt-3 placeholder:text-white/50" placeholder="Email"/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)}className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md mt-3 placeholder:text-white/50" placeholder="Password" type="password"/>
                    <input value={confPassword} onChange={(e) => setConfPassword(e.target.value)}className="outline-none px-3 py-1 text-white/90 text-lg bg-red-200/30 rounded-md mt-3 placeholder:text-white/50" placeholder="Confirm Password" type="password"/>

                    <p className="text-sm text-red-200/70 mt-3 cursor-pointer hover:text-white" onClick={() => setState(State.LOGIN)}>Already have an account? Login</p>
                    <button className="text-white text-lg font-bold px-5 mt-5 self-center py-1 hover:scale-105 hover:bg-white hover:rounded-lg hover:text-red-500 w-fit h-fit" onClick={(e) => {onRegisterHandler(e)}}>Register</button>
                </div>
            </div> }
        </form>
      </main>
    </>
  );
}
