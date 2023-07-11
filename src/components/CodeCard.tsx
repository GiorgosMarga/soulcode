import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import SyntaxHighlighter  from 'react-syntax-highlighter'
import { motion } from 'framer-motion'
import { api } from '~/utils/api'

interface input {
    username: string 
    code: string 
    index: number 
    keyIndex: number
    codeId: string
    onChangeContent: () => void
}
const CodeCard = ({code,username, onChangeContent,index,keyIndex, codeId}:input) => {
    const like = api.like.likeCode.useMutation()

    const likeCodeHandler = () => {
        like.mutate({codeId})
        onChangeContent()
    }

    if(index !== keyIndex){
        return null
    }
  return <motion.div 
        initial={{
            x: 0,
            opacity: 0,
            scale: 0
        }}
        transition={{
            duration: 0.4,
        }}
        exit={{
            x: 100,
            opacity:0

        }}
        whileInView={{ opacity: 1, x: 0 ,scale:1}}
        className={`flex  h-[60%] w-[45%] rounded-3xl shadow-lg shadow-black flex-col `}>
        <div className='w-[100%] h-[85%] rounded-3xl'>
            <div className='flex items-center pl-5 pt-2 space-x-2 text-white'>
                <div className='h-9 w-9  bg-red-500 rounded-full'/>
                <p>{username}</p>
            </div>
            <SyntaxHighlighter language="go" className="min-h-[400px] scrollbar-hide max-h-[400px] mt-5 rounded-lg" >
                {code ?? "//You have seen all. Congrats"}
            </SyntaxHighlighter>  
        </div>
        <div className='flex items-center justify-evenly mt-2'>
            <XMarkIcon className=' w-14 h-14 text-red-500 cursor-pointer' onClick={() => onChangeContent()}/>
            <CheckIcon className='text-green-500 w-14 h-14 cursor-pointer' onClick={likeCodeHandler}/>

        </div>
    </motion.div>
  
}

export default CodeCard