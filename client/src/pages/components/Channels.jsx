import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { io } from "socket.io-client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh, faArrowRightFromBracket, faX, faGear, faUser ,faUserPlus, faChevronRight, faChevronDown, faUserGroup, faMagnifyingGlass, faShieldHalved, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
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
  
  const [filterMenu, setFilterMenu] = useState({
    userPopup: false,
    user: "",
  })

  const [input, setInput] = useState({
    serverName: selectedServer.name,
    searchMembers: ""
  })
  useEffect(() => {
    setInput({serverName: selectedServer.name})
  }, [selectedServer])

  function invite(){
    navigator.clipboard.writeText(selectedServer._id)
    setText('Copied')
    setTimeout(() => setText('Copy'), 1000)
  }
  async function leaveServer() {
    selectedServer.serverUsers.map((selectedUser) => {
      if (selectedUser.email === user.email) {
        axios.post(`${process.env.REACT_APP_SERVER}/leaveServer`, { serverID: selectedServer._id, user: selectedUser }).then((res) => {
          setData(res.data);
          setSelected({ serverID: null, channelID: null });
          socket.emit('leaveServer', { serverID: selectedServer._id });
        });
      }
      return null; // Add return statement
    });
  }

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Overview",
    "Roles",
    "Emoji",
    "Audit Log",
    "Bans",
    "Custom Invite Link"
  ];

  const showSettingsMenu = () => {
    switch (steps[currentStep]) {
      case "Overview":
        return (
        <div className='w-[500px]'>
          <p className='mb-2 font-bold'>Server Overview</p>
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
                    value={selectedChannel || ""}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none"
                  >
                    {selectedServer.channels.map((channel, index) => (
                      <option key={index} value={channel.id}>
                        {channel.name}
                      </option>
                    ))}
                  </select>
                  {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <FontAwesomeIcon icon={faAngleDown} className="text-gray-400" />
                  </div> */}
                </div>
              </div>
          </div>
        </div>)
      case "Roles":
        return (
          <div className='w-[500px] space-y-3'>
            <p className='font-bold'>Roles</p>
            <p className='text-ssm text-gray-100'>Use roles to group your server members and assign permissions.</p>

            <button className='w-full bg-[#2B2D31] hover:bg-black-50 group rounded-md p-2 pr-5 items-center flex justify-between'>
            <div className='col-span-3 space-x-3 flex'>
              <div className='items-center flex'>
                  <FontAwesomeIcon icon={faUserGroup} className='bg-black-100 text-gray-100 group-hover:text-white p-2 rounded-full items-center justify-center flex text-ssm' />
              </div>
              <div className="text-sm text-left">
                <p className='text-gray-100 font-bold'>Default Permissions</p>
                <p className='text-gray-200 text-ssm font-medium'>@everyone - applies to all server members</p>
              </div>
            </div>
              <FontAwesomeIcon icon={faChevronRight} className='text-sm text-gray-100 font-thin col-span-1'/>
            </button>

            <div className='flex items-center'>
              <div className='items-center flex w-full'>
                <input value={input.serverName} type="text" onChange={(e) => setInput({...input, serverName:e.target.value})}
                  className="w-full px-2 py-2 text-sm rounded-l-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none"/>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100 bg-[#1E1F22] py-2.5 px-2 rounded-r-sm'/>
              </div>
              <button className='bg-blue-50 hover:bg-blue-200 px-3 py-2 text-ssm w-24 rounded-sm'>Create Role</button>
            </div>
            <p className='text-ssm text-gray-100'>Members use the color of the highest role they have on this list. Drag roles to reorder them.</p>

            <div>
              <div className='grid grid-cols-2 w-full border-b border-[#46484b] pb-2'>
                <p className='text-ssm font-bold text-gray-100'>ROLES - {selectedServer.serverRoles.length}</p>
                <p className='text-ssm font-bold text-gray-100'>MEMBERS</p>
              </div>
              {selectedServer.serverRoles.map((role, index) => (
                <div key={index} className='grid grid-cols-2 group w-full border-b border-[#46484b] hover:bg-black-50 py-2'>
                  <div className='flex items-center mx-5 space-x-2'>
                  <FontAwesomeIcon icon={faShieldHalved} style={{color: role.color}}/>
                  <p className='text-ssm text-gray-100'>{role.name}</p>
                  </div>
                  <div className="text-gray-100 text-sm pl-5 flex items-center justify-between">
                    <p>
                    {selectedServer.serverUsers.filter((user) => user.roles[0] === role.name).length} <FontAwesomeIcon icon={faUser}/>
                    </p>
                    <button className="bg-black-200 group-hover:bg-black-400 transition-all px-2 py-1 mx-2 rounded-full"><FontAwesomeIcon icon={faEllipsis} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>)
      case "Emoji":
        return (
          <div className='w-[500px] space-y-3'>
            <p className='font-bold'>Emoji</p>
            <p className='text-ssm text-gray-100'>Add up to 50 custom emoji that anyone can use in this server.</p>

            <p className='text-ssm text-gray-100'>UPLOAD REQUIREMENTS</p>
            <ul className='list-disc list-inside text-ssm text-gray-100'>
              <li>File type: JPEG, PNG, GIF</li>
              <li>Recommended file size: 256 KB(We'll compress it for you)</li>
              <li>Recommended dimensions: 128x128</li>
              <li>Naming: Emoji names must be at least 2 characters long and can only contain alphanumeric characters and underscores</li>
            </ul>
            <button className='bg-blue-50 hover:bg-blue-200 px-3 py-2 text-ssm w-24 rounded-sm'>Upload Emoji</button>

            <p className="text-sm font-medium">Emoji - X slots available</p>        
            <div className='grid grid-cols-2'>
              <div className='flex space-x-5'>
                <p className="text-ssm font-bold text-gray-100 text-left">IMAGE</p>
                <p className="text-ssm font-bold text-gray-100 text-left">NAME</p>
              </div>
              <p className="text-ssm font-bold text-gray-100 text-left">UPLOADED BY</p>
            </div>

            <div className='flex space-x-2 group'>
              <div className='grid grid-cols-2 group border-b border-[#46484b] py-3'>
                <div className='flex space-x-5'>
                  <img src={process.env.REACT_APP_IMG} className="w-8" alt='emote'/>
                  <input value={input.serverName} type="text" onChange={(e) => setInput({...input, serverName:e.target.value})}
                    className="text-sm rounded-l-sm group-hover:bg-[#1E1F22] focus:bg-[#1E1F22] bg-black-100 transition-all text-gray-300 border-0 ring-0 outline-none resize-none"/>
                </div>
                <div className='flex items-center ml-5'>
                  <img src={process.env.REACT_APP_IMG} className="w-8" alt='emote'/>
                  <p className='text-ssm text-gray-100 -mt-1'>username</p>
                </div>
              </div>
              <button className='text-red-500 border border-black-400 rounded-full hidden  w-5 h-5 text-ssm group-hover:flex -mt-5 items-center justify-center'><FontAwesomeIcon icon={faX}/></button>
            </div>
            
            
          </div>)
      case "Audit Log":
        return (
          <div className='w-[500px] space-y-3'>
            <div className='flex justify-between border-b border-[#46484b] pb-4 mb-2'>
              <p className='font-bold'>Audit Log</p>
              <div className='flex flex-col'>
                <div className='flex  gap-3 text-gray-200 text-ssm'>
                <p>Filter by User<button onClick={() => setFilterMenu({...filterMenu, userPopup: !filterMenu.userPopup})}  className='ml-3'>All <FontAwesomeIcon icon={faChevronDown}  className='text-white mx-0.5 text-[8px]'/></button></p>
                </div>
              {filterMenu.userPopup && (
              <div className='bg-black-100 border border-black-50 absolute mt-7 shadow-inner p-2'>
                <div className='flex'>
                <input value={input.searchMembers} type="text" onChange={(e) => setInput({...input, searchMembers:e.target.value})} placeholder='Search Members'
                  className=" px-2 py-2 mb-2 text-sm rounded-l-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none"/>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100 bg-[#1E1F22] py-2.5 px-2 rounded-r-sm'/>
                </div>
                <div className='space-y-1 max-h-[200px] shadow-3xl overflow-auto no-scrollbar'>
                <button className='flex justify-between items-center text-white w-full px-2 py-3 bg-blue-50 rounded-md'><span className='flex items-center text-sm gap-2'><FontAwesomeIcon icon={faUserGroup} alt="All user" className='w-6'/>All Users</span> <FontAwesomeIcon icon={faCircleCheck} className='text-sm'/></button>
                {selectedServer.serverUsers.map((user, index) => (
                  <button key={index} className='flex justify-between items-center text-gray-100 w-full px-2 py-3 hover:bg-black-50 rounded-md'><span className='flex items-center text-ssm gap-2'><img src={user.imageUrl} alt="user" className='w-6 rounded-full'/> {user.name}</span></button>
                  ))}
                </div>
              </div>)}
              </div>
            </div>
            
            
            <div className='space-y-2'>
              <div className='w-full flex items-center text-sm py-1 px-2 rounded-md bg-black-200 border border-black-400'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100'/>
                    <img src={process.env.REACT_APP_IMG} alt="user" className='w-10 rounded-full'/>
                    <p className='text-gray-100'>username do blabllalbal.</p>
              </div>
            </div>
          </div>)
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
              {steps.map((step, index) => (
                <div key={index}>
                {index===3 && 
                  <span>
                    <div className='border-t border-[#46484b] my-2'></div>
                    <p className='flex p-1 text-ssm font-bold'>MODERATION</p>
                  </span>
                }
                <li key={index} onClick={()=> setCurrentStep(index)} className={`p-1 cursor-pointer rounded-md ${currentStep===index ? 'text-white bg-black-focus' :'hover:bg-black-hover'}`}>{step}</li>
                </div>
              ))}
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