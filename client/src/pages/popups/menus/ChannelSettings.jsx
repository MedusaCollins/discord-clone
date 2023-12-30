import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import { io } from "socket.io-client";

const ChannelSettings = ({selectedServer, input, setInput, popup, setPopup}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const channelSettings = [
        "Overview",
        "Permissions"
    ]

    const [socket, setSocket] = useState(null);
    useEffect(() => {
      const socket = io(process.env.REACT_APP_SERVER);
      setSocket(socket);
    }, []);

    function deleteChannel(channel){
      socket.emit('deleteChannel', {server: selectedServer, channel: channel})
      setPopup({...popup, channelSettings: false, showPopup: false})
    }

    const showChannelSettingsMenu = () => {
        switch (channelSettings[currentStep]) {
          case "Overview":
            return (
            <div className='w-[500px]'>
              <p className='mb-2 font-bold'>Channel Overview</p>
              <div className='divide-y divide-[#46484b] space-y-6'>
                <div className='grid grid-cols-2 space-x-3'>
                  <div className='grid grid-cols-3 space-x-5'>
                    <img src={selectedServer.image} alt='server' className='rounded-full w-20'/>
                    <div className='col-span-2 space-y-3'>
                    <p className='text-ssm text-gray-100'>We recommend an image of at least 512x512 for the server.</p>
                    <button className='text-ssm border border-[#46484b] rounded-sm px-2 py-1.5'>Upload Image</button>
                    </div>
                  </div>
                </div>
                <div className='pt-5'>
                    <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                      CHANNEL NAME
                    </label>
                    <input value={input.serverName} type="text" onChange={(e) => setInput({...input, serverName:e.target.value})}
                    className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                  </div>
              </div>
            </div>)
            default:
              return true;
        }
      }

  return (
    <div className="fixed inset-0 z-50 flex text-white text-left bg-[#313338]">
        <div className='bg-[#2B2D31] w-[38.4%] items-end px-2 text-left flex flex-col divide-y divide-[#46484b] space-y-3'>
            <ul className='w-40 text-sm text-gray-100 pt-5'>
              <p className='flex p-1 text-ssm font-bold'>{popup.channelInfo.name}</p>
              {channelSettings.map((step, index) => (
                <div key={index}>
                <li key={index} onClick={()=> setCurrentStep(index)} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep===index ? 'text-white bg-black-focus' :'hover:bg-black-hover'}`}>{step}</li>
                </div>
              ))}
              <span>
                <div className='border-t border-[#46484b] my-2'></div>
                <button className="p-1 my-0.5 cursor-pointer rounded-md hover:bg-black-hover w-full text-left flex justify-between items-center" onClick={() => deleteChannel(popup.channelInfo)}><p>Delete Channel</p><FontAwesomeIcon icon={faTrashCan} className='mx-0.5 text-ssm right-2 top-2'/></button>
              </span>
            </ul>
        </div>        
        <div className='flex pt-5 ml-8 space-x-8'>
              {showChannelSettingsMenu()}
            <button className="text-3xl text-gray-200 hover:text-gray-100 h-0" onClick={()=> setPopup({...popup, channelSettings: false, showPopup: false})}><FontAwesomeIcon icon={faCircleXmark} /></button>
        </div>        
      </div> 
  )
}

export default ChannelSettings