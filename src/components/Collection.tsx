import React from 'react'
import Code from './Code'
import AddCode from './AddCode'
import { api } from '~/utils/api'
import {Bars} from "react-loader-spinner"
const Collection = ({setShowHandler}:{setShowHandler: ()=> void}) => {
  const codes = api.code.getUserCodes.useQuery()

  return (
    <div className='w-[100%] px-5 flex xl:justify-start justify-center flex-wrap overflow-auto scrollbar-hide'>
        {(codes && codes.isLoading) && <div className='w-[100%] h-[100%] flex justify-center items-center'><Bars height="40"
            width="40"
            color="#EF4444"            
            visible={true}
            /></div>}
        {(codes && codes.data) && codes.data.map((code) => {
          return <Code key={code.id} content={code.content} language={code.language}/>
        })} 
        {(codes && codes.data) && <AddCode setShowHandler={setShowHandler}/>}
    </div>
  )
}

export default Collection