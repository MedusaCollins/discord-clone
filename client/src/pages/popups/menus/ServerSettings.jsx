import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUserGroup, faMagnifyingGlass, faCircleCheck, faGavel, faCircle, faEyeDropper, faXmark, faCheck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

const ServerSettings = (
    {selectedServer, setPopup, popup, input, setInput, selected, filterMenu, setFilterMenu }
) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [selectedServer]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const serverSettings = [
    "Overview",
    "Roles",
    "Emoji",
    "Audit Log",
    "Bans"
  ];
  const [selectedChannel, setSelectedChannel] = useState(selected.channelID)
  const permissions = [
    { name: "Manage Server", key: "manageServer", description: "Allows members to delete messages by other members." },
    { name: "Manage Channels", key: "manageChannels", description: "Allows members to create, edit or delete channels." },
    { name: "Manage Roles", key: "manageRoles", description: "Allows members to create new roles and edit or delete roles lower than their highest role. Also allows members to change permissions of individual channels that they have access to." },
    { name: "Manage Members", key: "manageUsers", description: "Allows members to remove other members from this server." },
    { name: "Manage Messages", key: "manageMessages", description: "Allows members to delete messages by other members." },
    { name: "Manage Voice", key: "manageVoice", description: "Allows members to mute/deafen/move/disconnect other members in voice channels." },
    { name: "Create Expressions", key: "manageEmojis", description: "Allows members to add custom emoji in this server." },

  ];

  function selectRole(role){
    setSelectedRole(role)
    console.log(role)
    setInput({...input, roleName: role.name, roleColor: role.color, roleAccess: role.access})
  }

  useEffect(() => {
    selectRole(selectedServer.serverRoles[0])
  },[selectedServer, popup])
  useEffect(()=> {
    if(selectedServer !== null && selectedServer !== undefined && selectedRole !== null && selectedRole !== undefined){

      if(input.serverName !== selectedServer.name || input.roleName !== selectedRole.name || input.roleColor !== selectedRole.color || input.roleAccess !== selectedRole.access){
        setUnsavedChanges(true)
      }else{
        setUnsavedChanges(false)
      }
    }
  },[input])


  const saveChanges = (e) => {
    e.preventDefault();
    socket.emit("updateServer", { serverID: selectedServer._id, serverName: input.serverName, roleID: selectedRole._id, roleName: input.roleName, roleColor: input.roleColor, roleAccess: input.roleAccess})
    }
    const resetChanges = (e) => {
      e.preventDefault();
      setInput({...input, serverName: selectedServer.name})
    }
  const showSettingsMenu = () => {
    switch (serverSettings[currentStep]) {
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
          <div className='w-[500px] grid grid-cols-7'>
            <div className='col-span-2 border-r border-[#46484b] px-1.5'>{selectedServer.serverRoles.map((role, index) => (
              <button key={index} onClick={() => selectRole(role)} className={`${selectedRole !==null && selectedRole !==undefined && selectedRole.name === role.name ? 'bg-black-focus':'hover:bg-black-hover'} rounded-md px-2 py-1 my-0.5 text-sm gap-2 flex items-center w-full`}><FontAwesomeIcon icon={faCircle} className='w-3' style={{color: role.color}}/>{role.name}</button>
            ))}
            </div>
              <div className='col-span-5 pl-5'>
              {selectedRole !== null && selectedRole !== undefined ? (
                <>
                <h1>Edit Role - {selectedRole.name}</h1>
                <div className='flex items-center gap-5 border-b my-5 border-[#46484b]'>
                  <button onClick={() => setSelectedPage(0)} className={`${selectedPage===0?' border-[#949CF7]':'hover:border-[#5865F2] border-black-100 hover:text-gray-100 text-gray-200'} border-b-2 pb-2`}>Display</button>
                  <button onClick={() => setSelectedPage(1)} className={`${selectedPage===1?' border-[#949CF7]':'hover:border-[#5865F2] border-black-100 hover:text-gray-100 text-gray-200'} border-b-2 pb-2`}>Permission</button>
                  <button onClick={() => setSelectedPage(2)} className={`${selectedPage===2?' border-[#949CF7]':'hover:border-[#5865F2] border-black-100 hover:text-gray-100 text-gray-200'} border-b-2 pb-2`}>Manage Member</button>
                </div>
                <div>
                {selectedPage === 0 && (
                  <div>
                    <label htmlFor="Change Role Name" className="block text-ssm font-bold leading-6 text-gray-100">
                      ROLE NAME <span className='text-red-500'>*</span>
                    </label>
                    <input value={input.roleName} type="text" onChange={(e) => setInput({...input, roleName:e.target.value})}
                    className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                    <div className='border-t border-[#46484b] my-5'></div>
                    <label htmlFor="Change Role Color" className="block text-ssm font-bold leading-6 text-gray-100 -space-y-1 mb-2">
                      ROLE COLOR <span className='text-red-500'>*</span>
                      <p className='font-normal'>Members use the color of the highest role they have on the roles List.</p>
                    </label>
                    <div className='flex items-center gap-2'>
                      <button className='w-14 h-12 relative rounded-md border border-[#46484b]' style={{backgroundColor: input.roleColor}}><FontAwesomeIcon icon={faEyeDropper} className='absolute right-2 top-2 text-sm'/></button>

                      <div className='grid grid-cols-10 grid-rows-2 gap-2'>
                        {['#2dd4bf', '#34d399', '#60a5fa', '#c084fc', '#f472b6', '#facc15', '#fb923c', '#f87171', '#9ca3af', '#94a3b8',
                          '#0d9488', '#059669', '#2563eb', '#9333ea', '#db2777', '#ca8a04', '#ea580c', '#dc2626', '#4b5563', '#475569'].map((color, index) => (
                            <button key={index} className={`w-5 h-5 relative rounded-md`} style={{backgroundColor: `${color}`}}
                              onClick={() => {
                                setInput({...input, roleColor: color})
                              }}></button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedPage === 1 && (
                  <div>
                    <ul>
                      {permissions.map((permission, index) => (
                        <li key={index} className='border-b border-[#46484b] pb-5 my-3'>
                          <div className='flex items-center justify-between my-2'>
                            <p className='text-sm text-white'>{permission.name}</p>
                            <div onClick={() => setInput({...input, roleAccess:{...input.roleAccess, [permission.key]: !input.roleAccess[permission.key]}})} 
                              className={`cursor-pointer h-6 w-10 rounded-full p-1 ring-1 ring-inset duration-200 transition ease-in-out ${input.roleAccess[permission.key] ? 'bg-indigo-600 ring-black/20' : 'bg-[#80848E] ring-slate-900/5'}`}>
                              <div className={`h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 text-[#80848E] justify-center items-center flex transition duration-200 ease-in-out ${input.roleAccess[permission.key] && 'translate-x-4'}`}>
                                <FontAwesomeIcon icon={input.roleAccess[permission.key] ? faCheck : faXmark} className='text-ssm'/>
                              </div>
                            </div>
                          </div>
                          <p className='text-ssm text-gray-100'>{permission.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedPage === 2 && (
                  <div>
                    <button className='bg-blue-50 hover:bg-blue-200 px-3 py-2 mb-5 text-ssm rounded-sm w-full transition-all'>Add Members</button>
                    <div className='flex flex-col'>
                      {selectedServer.serverUsers.map((user, index) => {
                        if(user.roles[0] === selectedRole.name) {
                          return (
                            <div key={index} className='flex justify-between p-2 rounded-md hover:bg-black-50'>
                              <div className='flex gap-2'>
                                <img src={user.imageUrl} alt="user" className='w-6 h-6 rounded-full'/>{user.name}
                              </div>
                              <button><FontAwesomeIcon icon={faXmarkCircle} className='text-gray-200 hover:text-gray-100'/></button>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
                </div>
                </>
              ):null}
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
              <button className='text-red-500 border border-black-400 rounded-full hidden  w-5 h-5 text-ssm group-hover:flex -mt-5 items-center justify-center'><FontAwesomeIcon icon={faXmark}/></button>
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
        return (
          <div className='w-[500px] space-y-3'>
            <p className='font-semibold'>Server Ban List</p>
            <p className='text-ssm text-gray-100'>Bans by default are by account and IP. A user can circumvent an IP ban by using a proxy.</p>

            <div className='flex items-center gap-2'>
              <div className='items-center w-full flex'>
                <input value={input.searchUserId} type="text" onChange={(e) => setInput({...input, searchUserId:e.target.value})} placeholder='Search Bans by User Id'
                  className="px-2 py-1.5 text-sm rounded-l-sm bg-[#1E1F22] w-full text-gray-300 border-0 ring-0 outline-none resize-none"/>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100 bg-[#1E1F22] py-2 px-2 rounded-r-sm'/>
              </div>
              <button className='bg-blue-50 hover:bg-blue-200 px-3 py-2 text-ssm rounded-sm'>Search</button>
            </div>


            {/* Buradaki kısımda databaseyi düzelttikten sonra banlanan birisi varsa alttaki şekilde gösterilecek */}
            <div className='flex flex-col items-center justify-center rounded-md text-sm text-gray-200 border border-black-300 border-b-2 shadow-3xl h-[500px] space-y-2'>
              <FontAwesomeIcon icon={faGavel} className='text-6xl mb-10'/>
              <p className='font-bold text-gray-100'>NO BANS</p>
              <p className='w-64'>You haven't banned anybody... but if and when you must, do not hesitate!</p>
            </div>

            {/* <div className='flex flex-col items-center p-3 rounded-md text-sm text-gray-200 border border-black-300 border-b-2 shadow-3xl h-[500px] space-y-0.5'>
            {selectedServer.serverUsers.map((user, index) => (
                  <button onClick={()=> setFilterMenu({...filterMenu, banPopup: true, selectedUser: user})} key={index} className='flex justify-between items-center w-full px-2 py-3 text-gray-100 bg-[#3F4147] hover:bg-black-50 rounded-md'><span className='flex items-center text-ssm gap-2'><img src={user.imageUrl} alt="user" className='w-6 rounded-full'/> {user.name}</span></button>
                ))}
            </div> */}
            
          </div>)
      default:
        return true;
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex text-white text-left bg-[#313338]">
        <div className='bg-[#2B2D31] w-[38.4%] items-end px-2 text-left flex flex-col divide-y divide-[#46484b] space-y-3'>
            <ul className='w-40 text-sm text-gray-100 pt-5'>
              <p className='flex p-1 text-ssm font-bold'>{selectedServer.name}</p>
              {serverSettings.map((step, index) => (
                <div key={index}>
                {index===3 && 
                  <span>
                    <div className='border-t border-[#46484b] my-2'></div>
                    <p className='flex p-1 text-ssm font-bold'>MODERATION</p>
                  </span>
                }
                <li key={index} onClick={()=> setCurrentStep(index)} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep===index ? 'text-white bg-black-focus' :'hover:bg-black-hover'}`}>{step}</li>
                </div>
              ))}
            </ul>
        </div>        
        <div className='flex pt-5 ml-8 space-x-8'>
              {showSettingsMenu()}
            <button className="text-3xl text-gray-200 hover:text-gray-100 h-0" onClick={()=> setPopup({...popup, serverSettings: false, showPopup: false})}><FontAwesomeIcon icon={faCircleXmark} /></button>
            {unsavedChanges && (
              <div className='justify-between items-center flex bg-black-400 px-2 py-2 w-[600px] rounded-md fixed bottom-5'> 
              <p className='text-sm text-gray-50'>Careful - you have unsaved changes!</p>
              <div className='flex gap-5'>
                <button type='text' onClick={resetChanges} className='px-3 py-1 text-sm text-gray-50 hover:underline'>Reset</button>
                <button type='submit' onClick={saveChanges} className='px-3 py-1 text-sm bg-green-700 hover:bg-green-900 transition-all rounded-sm'>Save Changes</button>
              </div>
            </div>
            )}
        </div>        
      </div> 
  )
}

export default ServerSettings