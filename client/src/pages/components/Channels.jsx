import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'

const Channels = (params) => {
  const {selected, selectedServer, setSelected, user} = params
  return (
    <div className="w-[10%] h-screen bg-black-200 text-white flex flex-col relative justify-between">
      {selectedServer.channels != null &&
        <div>
          <p className='justify-between items-center flex px-5 py-2 hover:bg-black-hover cursor-pointer transition-all'>{selectedServer.name} 
            <span className='text-sm'><FontAwesomeIcon icon={faAngleDown} /></span>
          </p>

          {selectedServer.channels.map((channel,index) => (
            <div key={index} onClick={() => (selected.channelID!==channel._id ? setSelected({...selected, channelID:channel._id}) : null)} 
            className={`flex items-center h-7 mx-2 my-1 px-2 cursor-pointer rounded-md transition-all
            ${selected.channelID===channel._id ? 'bg-black-focus' :'hover:bg-black-hover'}`}>

              <span className='text-sm text-[#80848E] flex gap-5 items-center'>
                {channel.type==='text' ? <FontAwesomeIcon icon={faHashtag} className='mx-0.5'/> :
                 <FontAwesomeIcon icon={faVolumeHigh} />} <span className={`${selected.channelID===channel._id ? 'text-white' :''}`} >{channel.name}</span>
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