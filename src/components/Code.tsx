import React from 'react'
import  SyntaxHighlighter  from 'react-syntax-highlighter'

const Code = ({content,language}:{content:string,language:string}) => {
  return (
    <div className='m-1 hover:scale-105 transition-all duration-100 ease-in w-[380px] h-[350px] rounded-3xl shadow-lg'>
        <SyntaxHighlighter wrapLongLines language={language} className="min-h-[350px] scrollbar-hide max-h-[350px] mt-5 rounded-lg" >
                {content}
        </SyntaxHighlighter> 
    </div>
  )
}

export default Code