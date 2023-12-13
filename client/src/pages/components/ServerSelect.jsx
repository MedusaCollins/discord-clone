import React from 'react'
import data from './Data'

const ServerSelect = (params) => {
  
  return (
    <div className="w-[3%] h-screen bg-black-400 py-5 space-y-3">
      <div className='flex relative group cursor-pointer' onClick={() => (params.selected.server!==null ? params.setSelected({...params.selected, server:null}) : null)}>
          <div className={`w-[0.200rem] ${params.selected.server===null ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
          <div className='flex mx-auto items-center justify-center'>
            <img src={process.env.REACT_APP_IMG} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${params.selected.server===null ? 'rounded-xl': 'rounded-3xl'} bg-black-200 transition-all duration-300`}/>
          </div>
      </div>

      {data.map((server,index) => (
        <div key={index} className='flex relative group cursor-pointer' onClick={() => (params.selected.server!==index ? params.setSelected({...params.selected, server:index}) : null)}>
          <div className={`w-[0.200rem] ${params.selected.server===index ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
          <div className='flex mx-auto items-center justify-center'>
            <img src={server.image} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${params.selected.server===index ? 'rounded-xl': 'rounded-3xl'} transition-all duration-300`}/>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ServerSelect