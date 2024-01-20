import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCircle, faXmark, faCheck, faXmarkCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import { io } from "socket.io-client";

const ChannelSettings = ({selectedServer, selected, setSelected, input, setInput, popup, user, setPopup}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const channelSettings = [
        "Overview",
        "Permissions"
    ]
    const [selectedChannel, setSelectedChannel] = useState(selectedServer.channels.filter(channel => channel._id === selected.channelID)[0])
    const [focusRole, setFocusRole] = useState("left");
    const [selectedRole, setSelectedRole] = useState(selectedServer.serverRoles[0]);
    const [selectedPage, setSelectedPage] = useState(1);
    const [access, setAccess] = useState({
      read: false,
      write: false,
    })
    function selectRole(role){
      setSelectedRole(role)
      setInput({...input, roleName: role.name, roleColor: role.color, roleAccess: role.access})
    }
    useEffect(() => {
      setInput({...input, systemMessages: selectedServer.channels.filter(channel => channel.systemMessages === true)[0]?.name})
      
      if(selectedPage !== 2){
        selectRole(selectedServer.serverRoles[0])
      }
    },[selectedServer, popup])

    function checkAccess(params){
        return input.selectedChannel.access[params].includes(selectedRole.name)
    }

    useEffect(() => {
    setAccess({read: checkAccess('read'), write: checkAccess('write')})
    }, [selectedRole])
    const permissions = [
      { name: "Manage Server", key: "manageServer", description: "Allows members to delete messages by other members." },
      { name: "Manage Channels", key: "manageChannels", description: "Allows members to create, edit or delete channels." },
      { name: "Manage Roles", key: "manageRoles", description: "Allows members to create new roles and edit or delete roles lower than their highest role. Also allows members to change permissions of individual channels that they have access to." },
      { name: "Manage Members", key: "manageUsers", description: "Allows members to remove other members from this server." },
      { name: "Manage Messages", key: "manageMessages", description: "Allows members to delete messages by other members." },
      { name: "Manage Voice", key: "manageVoice", description: "Allows members to mute/deafen/move/disconnect other members in voice channels." },
      { name: "Create Expressions", key: "manageEmojis", description: "Allows members to add custom emoji in this server." },
  
    ];


    const [socket, setSocket] = useState(null);
    useEffect(() => {
      const socket = io(process.env.REACT_APP_SERVER);
      setSocket(socket);
    }, []);



    function deleteChannel(channel){
      socket.emit('deleteChannel', {server: selectedServer, channel: channel})
      socket.emit('addLog', {serverID: selectedServer._id, type: "deleteChannel", user: user, channelName: channel.name})
      setPopup({...popup, channelSettings: false, showPopup: false})
    }

    const showChannelSettingsMenu = () => {
        switch (channelSettings[currentStep]) {
          case "Overview":
            return (
            <div>
              <p className='mb-2 font-bold'>Overview</p>
                <div className='pt-5'>
                  <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                    CHANNEL NAME
                  </label>
                  <input value={input.selectedChannel.name} type="text" onChange={(e) => setInput({...input, selectedChannel: {...input.selectedChannel, name: e.target.value}})}
                  className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                </div>
            </div>)
          case "Permissions":
            return (
            <div className={window.innerWidth < 640 ? 'w-full' : 'w-[500px] -mx-8 grid grid-cols-7'}>
            <div className={`col-span-2 sm:border-r border-r-0 border-[#46484b] px-1.5 ${focusRole === "left" || selected.focus === "all" ? 'flex flex-col':'hidden'}`}>{selectedServer.serverRoles.map((role, index) => (
              <button key={index} onClick={() => {selectRole(role); setFocusRole("center")}} className={`${selectedRole !==null && selectedRole !==undefined && selectedRole.name === role.name ? 'bg-black-focus':'hover:bg-black-hover'} rounded-md px-2 py-1 my-0.5 text-sm gap-2 flex items-center w-full`}><FontAwesomeIcon icon={faCircle} className='w-3' style={{color: role.color}}/>{role.name}</button>
            ))}
            </div>
              <div className={`col-span-5 ${(focusRole === "center" || selected.focus === "all") && 'pl-5'}`}>
              {selectedRole !== null && selectedRole !== undefined && (focusRole === "center" || selected.focus === "all") ? (
                    <div>
                      <ul>
                        <li className='border-b border-[#46484b] pb-5 my-3'>
                          <div className='flex items-center justify-between my-2'>
                            <p className='text-sm text-white'>Read</p>
                            <div onClick={() => setAccess({...access, read: !access.read})} 
                              className={`cursor-pointer h-6 w-10 rounded-full p-1 ring-1 ring-inset duration-200 transition ease-in-out ${access.read ? 'bg-indigo-600 ring-black/20' : 'bg-[#80848E] ring-slate-900/5'}`}>
                              <div className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 text-[#80848E] justify-center items-center flex transition duration-200 ease-in-out ${access.read && 'translate-x-4'}`}>
                                <FontAwesomeIcon icon={access.read ? faCheck : faXmark} className='text-ssm'/>
                              </div>
                            </div>
                          </div>
                          <p className='text-ssm text-gray-100'>Allows members to view this channel.</p>
                        </li>
                        <li className='border-b border-[#46484b] pb-5 my-3'>
                          <div className='flex items-center justify-between my-2'>
                            <p className='text-sm text-white'>Write</p>
                            <div onClick={() => setAccess({...access, write: !access.write})} 
                              className={`cursor-pointer h-6 w-10 rounded-full p-1 ring-1 ring-inset duration-200 transition ease-in-out ${access.write ? 'bg-indigo-600 ring-black/20' : 'bg-[#80848E] ring-slate-900/5'}`}>
                              <div className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 text-[#80848E] justify-center items-center flex transition duration-200 ease-in-out ${access.write && 'translate-x-4'}`}>
                                <FontAwesomeIcon icon={access.write ? faCheck : faXmark} className='text-ssm'/>
                              </div>
                            </div>
                          </div>
                          <p className='text-ssm text-gray-100'>Allows members to write this channel.</p>
                        </li>
                      </ul>
                    </div>
                ):null}
              </div>
            </div>)
            default:
              return true;
        }
      }
  const resetChanges = (e) => {
    setInput({...input, selectedChannel: selectedServer.channels.filter(channel => channel._id === selectedChannel._id)[0]})
    setAccess({read: checkAccess('read'), write: checkAccess('write')})
  }
  const saveChanges = (e) => {
    socket.emit('updateChannel', { server: selectedServer, channel: input.selectedChannel, selectedRole: selectedRole.name, access: access})
    socket.emit('addLog', {serverID: selectedServer._id, type: "updateChannel", user: user, channelName: input.selectedChannel.name})
    setPopup({...popup, channelSettings: false, showPopup: false})
  }
  useEffect(()=> {
    if(selectedServer !== null && selectedServer !== undefined){
      if(input.selectedChannel.name !== selectedServer.channels.filter(channel => channel._id === selectedChannel._id)[0].name
      || access.read !== checkAccess('read')
      || access.write !== checkAccess('write')
      ){
        setUnsavedChanges(true)
      }else{
        setUnsavedChanges(false)
      }
    }
  },[input, access])

  const truncateText = (text) => {
    let limit = window.innerWidth < 470 ? 60 : window.innerWidth < 640 ? 90 : 25;
    if (text.length > limit) {
      return text.slice(0, limit) + '...';
    }
    return text;
  };
  return (
    <>
         <div className="fixed inset-0 z-50 flex text-white text-left bg-[#313338]">
         <div className={`bg-[#2B2D31] ${selected.focus === "left" || selected.focus === "all" ? 'flex flex-col': 'hidden'} ${window.innerWidth < 640 ? 'w-[100%] items-start': 'w-[50%] items-end'} text-left px-2 divide-y divide-[#46484b] space-y-3`}>
               <ul className={`${selected.focus === "left" || selected.focus ==="all" ? (window.innerWidth < 640 ? 'w-full' : 'w-40') : 'hidden'} text-sm text-gray-100 pt-5`}>
                 <p className='flex p-1 text-ssm font-bold'>{truncateText(popup.channelInfo.name)}</p>
                 {channelSettings.map((step, index) => (
                   <div key={index}>
                   <li key={index} onClick={()=> {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep===index ? 'text-white bg-black-focus' :'hover:bg-black-hover'}`}>{step}</li>
                   </div>
                 ))}
                 <span>
                   <div className='border-t border-[#46484b] my-2'></div>
                   {!selectedChannel.systemMessages ? (
                     <button className="p-1 my-0.5 cursor-pointer rounded-md hover:bg-black-hover w-full text-left flex justify-between items-center" onClick={() => deleteChannel(popup.channelInfo)}><p>Delete Channel</p><FontAwesomeIcon icon={faTrashCan} className='mx-0.5 text-ssm right-2 top-2'/></button>
                   ): (
                     <button className="p-1 my-0.5 rounded-md hover:bg-black-hover w-full text-left flex justify-between items-center cursor-not-allowed" ><p>Delete Channel</p><FontAwesomeIcon icon={faTrashCan} className='mx-0.5 text-ssm right-2 top-2'/></button>
                   )}
                 </span>
               </ul>
         </div>           

       
        <div className={`${selected.focus === "center" || selected.focus === "all" ? 'flex': 'hidden'} ${window.innerWidth > 750 && 'pt-5 mx-8 space-x-8'} flex-col w-full relative`}>
            <div className={`text-3xl text-gray-200 items-center ${window.innerWidth < 750 ? 'justify-between px-8 max-w-[750px]' : 'justify-end ml-12 max-w-[600px]'} flex my-5`}>
              <button className={`hover:text-gray-100 cursor-pointer relative right-0 ${window.innerWidth > 750 && 'hidden'}`} onClick={()=> {setSelected({...selected, focus: 'left'}); setFocusRole("left")}}><FontAwesomeIcon icon={faBars} /></button>
              <button className={`hover:text-gray-100 cursor-pointer relative right-0 `} onClick={()=> {setPopup({...popup, channelSettings: false, showPopup: false}); setSelected({...selected, focus: window.innerWidth < 640 ? 'left' : 'all'})}}><FontAwesomeIcon icon={faCircleXmark} /></button>
             </div>
              <div className="sm:w-[500px] px-8">
               {showChannelSettingsMenu()}
             </div>

          </div>
          {unsavedChanges && (
            // flex items-center justify-center bg-black-400 px-2 py-2 rounded-md bottom-5 w-[500px] absolute
            <div className={`flex items-center justify-center bg-black-400 px-2 py-2 mx-8 rounded-md bottom-5 max-w-[500px] absolute`}>
            <p className='text-sm text-gray-50'>Careful - you have unsaved changes!</p>
            <div className='flex gap-5'>
              <button type='text' onClick={resetChanges} className='px-3 py-1 text-sm text-gray-50 hover:underline'>Reset</button>
              <button type='submit' onClick={saveChanges} className='px-3 py-1 text-sm bg-green-700 hover:bg-green-900 transition-all rounded-sm'>Save Changes</button>
            </div>
          </div>
          )}
        </div>
    </> 
  )
  //   <div className="fixed inset-0 z-50 flex text-white text-left bg-[#313338]">
  //       <div className={`bg-[#2B2D31] ${selected.focus === "left" || selected.focus === "all" ? 'flex flex-col': 'hidden'} ${window.innerWidth < 640 ? 'w-[100%] items-start': 'w-[50%] items-end'} text-left px-2 divide-y divide-[#46484b] space-y-3`}>
  //             <ul className={`${selected.focus === "left" || selected.focus ==="all" ? (window.innerWidth < 640 ? 'w-full' : 'w-40') : 'hidden'} text-sm text-gray-100 pt-5`}>
  //               <p className='flex p-1 text-ssm font-bold'>{truncateText(popup.channelInfo.name)}</p>
  //               {channelSettings.map((step, index) => (
  //                 <div key={index}>
  //                 <li key={index} onClick={()=> {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep===index ? 'text-white bg-black-focus' :'hover:bg-black-hover'}`}>{step}</li>
  //                 </div>
  //               ))}
  //               <span>
  //                 <div className='border-t border-[#46484b] my-2'></div>
  //                 {!selectedChannel.systemMessages ? (
  //                   <button className="p-1 my-0.5 cursor-pointer rounded-md hover:bg-black-hover w-full text-left flex justify-between items-center" onClick={() => deleteChannel(popup.channelInfo)}><p>Delete Channel</p><FontAwesomeIcon icon={faTrashCan} className='mx-0.5 text-ssm right-2 top-2'/></button>
  //                 ): (
  //                   <button className="p-1 my-0.5 rounded-md hover:bg-black-hover w-full text-left flex justify-between items-center cursor-not-allowed" ><p>Delete Channel</p><FontAwesomeIcon icon={faTrashCan} className='mx-0.5 text-ssm right-2 top-2'/></button>
  //                 )}
  //               </span>
  //             </ul>
  //       </div>        

  //       <div className={`${selected.focus === "center" || selected.focus === "all" ? 'flex': 'hidden'} ${window.innerWidth > 750 && 'pt-5 mx-8 space-x-8'} flex-col w-full relative`}>
  //             <div className={`text-3xl text-gray-200 items-center ${window.innerWidth < 750 ? 'justify-between px-8 max-w-[750px]' : 'justify-end ml-12 max-w-[600px]'} flex my-5`}>
  //               <FontAwesomeIcon icon={faBars} className={`hover:text-gray-100 cursor-pointer relative ${window.innerWidth > 750 && 'hidden'}`} onClick={()=> {setSelected({...selected, focus: "left"}); setFocusRole("left")}}/>
  //               <FontAwesomeIcon icon={faCircleXmark} className={`hover:text-gray-100 cursor-pointer relative right-0 `} onClick={()=> {setPopup({...popup, serverSettings: false, showPopup: false}); setSelected({...selected, focus: window.innerWidth < 640 ? "left": "all" })}}/>
  //             </div>
  //             <div className="sm:w-[500px] px-8">
  //               {showChannelSettingsMenu()}
  //             </div>
  
  //             {unsavedChanges && (
  //               // flex items-center justify-center bg-black-400 px-2 py-2 rounded-md bottom-5 w-[500px] absolute
  //               <div className={`flex items-center justify-center bg-black-400 px-2 py-2 ml-16 rounded-md bottom-5 max-w-[500px] absolute`}>
  //               <p className='text-sm text-gray-50'>Careful - you have unsaved changes!</p>
  //               <div className='flex gap-5'>
  //                 <button type='text' onClick={resetChanges} className='px-3 py-1 text-sm text-gray-50 hover:underline'>Reset</button>
  //                 <button type='submit' onClick={saveChanges} className='px-3 py-1 text-sm bg-green-700 hover:bg-green-900 transition-all rounded-sm'>Save Changes</button>
  //               </div>
  //             </div>
  //             )}
  //       </div>
  //   </div> 
  // )
}

export default ChannelSettings