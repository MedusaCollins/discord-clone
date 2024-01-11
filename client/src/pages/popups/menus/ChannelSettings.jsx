import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import { io } from "socket.io-client";

const ChannelSettings = ({selectedServer, selected, input, setInput, popup, setPopup}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const channelSettings = [
        "Overview",
        "Permissions"
    ]
    const [selectedChannel, setSelectedChannel] = useState(selectedServer.channels.filter(channel => channel._id === selected.channelID)[0])

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
              <p className='mb-2 font-bold'>Overview</p>
                <div className='pt-5'>
                  <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                    CHANNEL NAME
                  </label>
                  <input value={input.selectedChannel.name} type="text" onChange={(e) => setInput({...input, selectedChannel: {...input.selectedChannel, name: e.target.value}})}
                  className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                </div>
            </div>)
            default:
              return true;
        }
      }
  const resetChanges = (e) => {
    e.preventDefault();
    setInput({...input, selectedChannel: selectedServer.channels.filter(channel => channel._id === selectedChannel._id)[0]})
  }
  const saveChanges = (e) => {
    e.preventDefault();
    socket.emit('updateChannel', { server: selectedServer, channel: input.selectedChannel})
    setPopup({...popup, channelSettings: false, showPopup: false})
  }
  useEffect(()=> {
    if(selectedServer !== null && selectedServer !== undefined){
      if(input.selectedChannel.name !== selectedServer.channels.filter(channel => channel._id === selectedChannel._id)[0].name
      ){
        setUnsavedChanges(true)
      }else{
        setUnsavedChanges(false)
      }
    }
  },[input])

  return (
    <>
      <div className='fixed inset-0 flex text-white text-left bg-[#313338] z-20'>
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
        {unsavedChanges && (
            <div className='justify-between items-center flex bg-black-400 px-2 py-2 w-[600px] rounded-md fixed  bottom-5 z-30'> 
              <p className='text-sm text-gray-50'>Careful - you have unsaved changes!</p>
              <div className='flex gap-5'>
                <button type='text' onClick={resetChanges} className='px-3 py-1 text-sm text-gray-50 hover:underline'>Reset</button>
                <button type='submit' onClick={saveChanges}  className='px-3 py-1 text-sm text-gray-50 bg-green-700 hover:bg-green-900 transition-all rounded-sm'>Save Changes</button>
              </div>
            </div>
            )}
    </> 
  )
}

export default ChannelSettings