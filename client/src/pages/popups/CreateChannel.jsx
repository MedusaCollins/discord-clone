import React, { useState, useEffect} from 'react'
import {io} from 'socket.io-client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleDot } from '@fortawesome/free-regular-svg-icons';

const CreateChannel = ({selectedServer, input, setInput, popup, setPopup, access}) => {
const [socket, setSocket] = useState(null);
useEffect(() => {
  const socket = io(process.env.REACT_APP_SERVER);
  setSocket(socket);
}, []);

function createChannel(){
    const request = {
      server: selectedServer,
      channel: {
        name: input.channelName,
        type: input.channelType,
        access: {
          "read": [
            "Owner",
            "Admin",
            "Moderator",
            "Member",
            "Guest"
          ],
          "write": [
            "Owner",
            "Admin",
            "Moderator",
            "Member"
          ]
        },
        messages: [],
      }
    }
    if(access.manageChannels){
      setPopup({...popup, createChannel: false, showPopup: false})
      socket.emit('createChannel', request);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-white bg-[#000000] bg-opacity-60" onClick={() => setPopup({...popup, createChannel: false, showPopup: false})}>
        <div className="relative bg-[#313338] rounded-md shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
          <div className="text-center sm:w-96">
              <div className='p-4 flex flex-col gap-5 text-left'>
                <p className='text-xl text-white'>Create Channel</p>
                <div className='flex flex-col gap-2 text-left text-ssm text-gray-100'>
                  <label htmlFor="Channel Type" className="block text-ssm -mb-2 font-bold leading-6 ">
                    CHANNEL TYPE
                  </label>
                  <button onClick={() => setInput({...input, channelType: "Text"})} className={`flex justify-between items-center ${input.channelType === "Text" ? 'bg-black-focus':'bg-black-200 hover:bg-black-hover '} rounded-md p-2 pb-3`}>
                    <div className='flex text-left gap-2 justify-items items-center'>
                      <FontAwesomeIcon icon={faHashtag} className='px-2 text-xl'/>
                      <div className='flex flex-col'>
                        <p className='text-base text-white'>Text</p>
                        <p>Send messages, images, GIFs, emoji, opinions, and puns</p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={input.channelType === "Text" ? faCircleDot : faCircle} className="text-lg"/>
                  </button>
                  <button onClick={() => setInput({...input, channelType: "Voice"})} className={`flex justify-between items-center ${input.channelType === "Voice" ? 'bg-black-focus':'bg-black-200 hover:bg-black-hover '} rounded-md p-2 pb-3`}>
                    <div className='flex text-left gap-2 justify-items items-center'>
                      <FontAwesomeIcon icon={faVolumeHigh} className='px-1 text-xl'/>
                      <div className='flex flex-col'>
                        <p className='text-base text-white'>Voice</p>
                        <p>Hang out together with voice, video and screen share</p>
                      </div>
                    </div>
                    <FontAwesomeIcon icon={input.channelType === "Voice" ? faCircleDot : faCircle} className="text-lg"/>
                  </button>
                </div>
                <div className='-mt-2'>
                <label htmlFor="channel name" className="block text-ssm font-bold leading-6 text-gray-100">
                  CHANNEL NAME
                </label>
                <input value={input.channelName || ''} type="text" onChange={(e) => setInput({...input, channelName:e.target.value})}
                className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
              </div>
              </div>
              <div className='flex p-4 justify-end gap-5 rounded-b-xl bg-black-200'>
                <button onClick={() => setPopup({...popup, createChannel: false, showPopup: false})} className='hover:underline text-ssm'>Cancel</button>
                <button onClick={()=> createChannel()}  className='text-white text-ssm px-3 py-2 rounded-sm bg-blue-50 hover:bg-blue-200'>Create Channel</button>
              </div>
          </div>
        </div>
        </div>
  )
}

export default CreateChannel