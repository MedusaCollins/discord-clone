import React from 'react'
import data from './Data'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

const Channels = (params) => {
  const {selected, setSelected, user} = params

  return (
    <div className="w-[10%] h-screen bg-black-200 text-white flex flex-col relative justify-between">
      {selected.server != null &&
        <div>
        <p className='justify-between flex p-2 hover:bg-black-hover cursor-pointer transition-all'>{data[selected.server].name} 
          <span><FontAwesomeIcon icon={faAngleDown} /></span>
        </p>

          {data[selected.server].channels.map((channel,index) => (
            <div key={index} onClick={() => (selected.channel!==index ? setSelected({...selected, channel:index}) : null)} 
                className={`flex items-center h-7 mx-2 my-1 px-2 cursor-pointer rounded-md transition-all
                ${selected.channel===index ? 'bg-black-focus' :'hover:bg-black-hover'}`}>

              <span className='text-sm text-[#80848E] flex gap-5 items-center'>
                {channel.type==='text' ? <FontAwesomeIcon icon={faHashtag} className='mx-0.5'/> :
                 <FontAwesomeIcon icon={faVolumeHigh} />} <span className={`${selected.channel===index ? 'text-white' :''}`} >{channel.name}</span>
              </span>
            </div>
          ))}
        </div>
      }
      <div className='bg-black-300 absolute bottom-0 w-full h-10 flex items-center'>
        <img src={user.imageUrl} alt="" className='w-6 h-6 rounded-full mx-2'/>
        <p className='text-sm'>{user.name}</p>
      </div>
    </div>
  )
}

export default Channels