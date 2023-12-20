import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { io } from "socket.io-client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh, faArrowRightFromBracket, faX, faGear, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

const Channels = (params) => {
  const {selected, selectedServer, setSelected,setData, user, popup, setPopup} = params
  const [text, setText] = React.useState('Copy')
  const [selectedChannel, setSelectedChannel] = useState(selected.channelID)

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);
  }, []);
  
  const [input, setInput] = useState({
    serverName: selectedServer.name,
  })
  useEffect(() => {
    setInput({...input, serverName: selectedServer.name})
  }, [selectedServer])

  function invite(){
    navigator.clipboard.writeText(selectedServer._id)
    setText('Copied')
    setTimeout(() => setText('Copy'), 1000)
  }
  async function leaveServer(){
    selectedServer.serverUsers.map(selectedUser=> {
      if (selectedUser.email === user.email){
        axios.post(`${process.env.REACT_APP_SERVER}/leaveServer`, {serverID: selectedServer._id, user: selectedUser}).then(res => {
          setData(res.data)
          setSelected({serverID: null, channelID: null})
          socket.emit('leaveServer', {serverID: selectedServer._id})
        })
      }
    })
  }

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Overview",
    "Members",
    "Roles",
    "Emoji",
    "Logs",
    "Bans",
    "Custom Invite Link"
  ];

  const showSettingsMenu = () => {
    switch (steps[currentStep]) {
      case "Overview":
        return (
        <div className='w-[500px]'>
          <p className='mb-2'>Server Overview</p>
          <div className='divide-y divide-[#46484b] space-y-6'>
            <div className='grid grid-cols-2 space-x-3'>
              <div className='grid grid-cols-3 space-x-5'>
                <img src={selectedServer.image} alt='server' className='rounded-full w-20'/>
                <div className='col-span-2 space-y-3'>
                <p className='text-ssm text-gray-100'>We recommend an image of at least 512x512 for the server.</p>
                <button className='text-ssm border border-[#46484b] rounded-sm px-2 py-1.5'>Upload Image</button>
                </div>
              </div>

              <div className='-mt-2'>
                <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                  SERVER NAME
                </label>
                <input value={input.serverName} type="text" onChange={(e) => setInput({...input, serverName:e.target.value})}
                className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
              </div>
            </div>
            <div className='pt-5'>
                <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                  SYSTEM MESSAGES CHANNEL
                </label>
                <div className="relative">
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none"
                  >
                    {selectedServer.channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        {channel.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <FontAwesomeIcon icon={faAngleDown} className="text-gray-400" />
                  </div>
                </div>
              </div>
          </div>
        </div>)
      case "Members":
        return <p>Members</p>
      case "Roles":
        return <p>Roles</p>
      case "Emoji":
        return <p>Emoji</p>
      case "Logs":
        return <p>Logs</p>
      case "Bans":
        return <p>Bans</p>
      case "Custom Invite Link":
        return <p>Custom Invite Link</p>
      default:
        return true;
    }
  };


  return (
    <div className="w-[10%] h-screen bg-black-200 text-white flex flex-col relative justify-between">
      {selectedServer.channels != null &&
        <div>
          <button onClick={() => popup.serverInfo ? setPopup({...popup, serverInfo:false}): setPopup({...popup, serverInfo:true})} className='justify-between items-center flex px-5 py-2 w-full hover:bg-black-hover cursor-pointer transition-all'>{selectedServer.name} 
            <span className='text-sm text-gray-100'><FontAwesomeIcon icon={popup.serverInfo ? faX : faAngleDown} /></span>
          </button>
          {popup.serverInfo && (
            <div className='bg-black-400 absolute w-[90%] m-2 rounded-md'>
              <ul className='p-2'>
                <li onClick={()=> setPopup({...popup, serverSettings:true, serverInfo:false})} className="hover:bg-blue cursor-pointer text-gray-100 hover:text-white hover:bg-blue-50 p-1 px-2 text-sm justify-between flex items-center rounded-sm">Server Settings <FontAwesomeIcon icon={faGear} /></li>
                <li onClick={()=> setPopup({...popup, invite:true})} className="hover:bg-blue-50 cursor-pointer text-blue-50 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Invite People <FontAwesomeIcon icon={faUserPlus} /></li>
                <li onClick={()=> leaveServer()} className="hover:bg-red-500 cursor-pointer text-red-500 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Leave Server <FontAwesomeIcon icon={faArrowRightFromBracket} /></li>
              </ul>
            </div>
          )}
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
        <button onClick={()=> params.setLogin(false)} className='right-2 absolute'><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
      </div>

      {popup.invite && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => setPopup({...popup, invite: false})}>
        <div className="relative bg-[#313338] rounded-xl shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
          <div className="text-center sm:w-96">
              <div className='p-4'>
                <p className='text-lg text-white font-semibold'>Invite friends to {selectedServer.name}</p>
                <div className='flex flex-col text-left mt-5'>
                  <label htmlFor="Server name" className="block text-ssm font-bold leading-6 text-gray-100">
                    SEND SERVER ID TO FRIENDS TO INVITE THEM
                  </label>
                  <div className='flex items-center justify-between bg-black-400 p-1'>
                    <input type="text" value={selectedServer._id} readOnly className="px-1 text-sm block w-full ring-0 outline-none bg-black-400 text-gray-100"/>
                    <button className={`text-white text-ssm px-5 py-2 rounded-sm bg-${text==="Copy" ?'blue-50': 'green-600'} hover:bg-${text==="Copy" ?'[#454fc0]': 'bg-green-400'}`} onClick={() => invite()}>{text}</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div> 
      )}
      {popup.serverSettings && (
      <div className="fixed inset-0 z-50 flex bg-[#313338]">
        <div className='bg-[#2B2D31] w-[38.4%] items-end px-2 text-left flex flex-col divide-y divide-[#46484b] space-y-3'>
            <ul className='w-40 text-sm text-gray-100 pt-5'>
              <p className='flex p-1 text-ssm font-bold'>{selectedServer.name}</p>
              <li onClick={()=> setCurrentStep(0)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Overview</li>
              <li onClick={()=> setCurrentStep(1)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Members</li>
              <li onClick={()=> setCurrentStep(2)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Roles</li>
              <li onClick={()=> setCurrentStep(3)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Emoji</li>
            </ul>
            
            <ul className='w-40 text-sm text-gray-100'>
              <p className='flex p-1 text-ssm font-bold'>MODERATION</p>
              <li onClick={()=> setCurrentStep(4)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Logs</li>
              <li onClick={()=> setCurrentStep(5)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Bans</li>
              <li onClick={()=> setCurrentStep(6)} className='p-1 hover:bg-black-50 cursor-pointer rounded-md'>Custom Invite Link</li>
            </ul>
        </div>        
        <div className='flex pt-5 ml-8 space-x-8'>
              {showSettingsMenu()}
            <button className="text-3xl text-gray-200 hover:text-gray-100 h-0" onClick={()=> setPopup({...popup, serverSettings: false})}><FontAwesomeIcon icon={faCircleXmark} /></button>
        </div>        
      </div> 
      )}
    </div>
  )
}

export default Channels