import React from 'react'
import data from './Data'

const ServerSelect = () => {
  return (
    <div className="w-[3.5%] h-screen bg-yellow-500 py-5 space-y-3">
      {data.map((server) => (
        <div key={server.id} className='flex relative group cursor-pointer'>
          <div className='w-1.5 h-5 rounded-r-xl my-2.5 bg-white  scale-0 group-hover:scale-100 absolute transition-all duration-300'></div>
          <div className='flex mx-auto items-center justify-center'>
            <img src={server.image} alt='server' className='w-10 rounded-3xl group-hover:rounded-xl transition-all duration-300'/>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ServerSelect