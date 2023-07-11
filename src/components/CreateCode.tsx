import React, { useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import {XMarkIcon} from "@heroicons/react/24/outline"
import { api } from '~/utils/api';
import {Bars} from "react-loader-spinner"

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

interface Input {
    show: boolean,
    setShow: () => void
}

const CreateCode = ({show,setShow}: Input) => {
  const [code,setCode] = useState("")
  const [language,setLanguage] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const createCode = api.code.createCode.useMutation()


  const onSubmitHandler = () => {
    createCode.mutate({content: code, language})
  }

  const onPressKeyHandler = (e:  React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key === "Tab"){
      e.preventDefault()
      const cursorPosition = e.currentTarget.selectionStart
      const newValue = code.substring(0,cursorPosition) + "   " + code.substring(cursorPosition)
      setCode(newValue)
      
      if(textAreaRef.current && textAreaRef.current.selectionStart &&  textAreaRef.current.selectionEnd){
        textAreaRef.current.value = newValue
        textAreaRef.current.selectionEnd  = textAreaRef.current.selectionStart = cursorPosition+3
      }

    }
  }
  return (
    <>
        <Modal
        isOpen={show}
        contentLabel="Example Modal"
        className="bg-[#0d0d0d] relative h-[70%] w-[70%] rounded-xl shadow-xl pt-10 flex flex-col items-center z-10 outline-none" 
        overlayClassName="bg-gray-500/50 absolute top-0 w-screen h-screen flex justify-center items-center z-10 "
        >
        <textarea ref={textAreaRef} value={code} className='w-[90%] max-h-[60%] min-h-[60%] outline-none bg-black/50 text-white px-3 rounded-xl pt-2' placeholder='//Write your code here' onChange={(e) => {setCode(e.target.value)}} onKeyDown={(e) => onPressKeyHandler(e)}/>
        <input value={language} onChange={(e) => {setLanguage(e.target.value)}} className='bg-black/50 rounded-xl mt-10 w-[90%] px-3 py-1 outline-none text-white' placeholder='go'/>
        <XMarkIcon className='w-7 h-7 text-red-500/70 absolute top-3 right-3 cursor-pointer' onClick={setShow}/>
        <button className='bg-red-500/70 rounded-2xl py-2 px-4 transition-all duration-100 hover:scale-105 ease-in mt-10' onClick={onSubmitHandler}>Upload Code</button>
        {createCode.isLoading && 
        <div className='mt-5'> <Bars height="30"
            width="30"
            color="#EF4444"            
            visible={true}
            /></div>
            
        }
      </Modal>
    </>
      
  );
}
export default CreateCode