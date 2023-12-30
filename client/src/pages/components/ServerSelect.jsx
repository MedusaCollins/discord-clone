import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus} from '@fortawesome/free-solid-svg-icons'

const ServerSelect = ({selected, setSelected, data, popup, setPopup}) => {

  return (
    <div className="w-[3%] h-screen bg-black-400 py-5">
      <div className='space-y-2'>
        <div className='flex relative group cursor-pointer' onClick={() => (selected.serverID!==null && setSelected({...selected, serverID:null}))}>
            <div className={`w-[0.200rem] ${selected.serverID===null ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
            <div className='flex mx-auto items-center justify-center'>
              <img src={process.env.REACT_APP_IMG} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${selected._id===null ? 'rounded-xl': 'rounded-3xl'} bg-black-200 transition-all duration-300`}/>
            </div>
        </div>
        <div className='border-t border-[#46484b] w-5 mx-auto'></div> 
        {data.map((server,index) => (
          <div key={index} className='flex relative group cursor-pointer' onClick={() => (selected.serverID!==server._id && setSelected({...selected, serverID:server._id}))}>
            <div className={`w-[0.200rem] ${selected.serverID===server._id ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
            <div className='flex mx-auto items-center justify-center'>
              <img src={server.image} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${selected.serverID===server._id ? 'rounded-xl': 'rounded-3xl'} transition-all duration-300`}/>
            </div>
          </div>
        ))}

        <div className='flex relative group cursor-pointer' onClick={()=> setPopup({...popup, createServer: true, showPopup: true})}>
          <div className='flex mx-auto items-center justify-center w-10 h-10 hover:rounded-xl rounded-3xl text-white bg-black-200 transition-all duration-300'>
              <FontAwesomeIcon icon={faPlus}/>
          </div>
        </div>
      </div>
        
    </div>
  )
}

export default ServerSelect