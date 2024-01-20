import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUserGroup, faMagnifyingGlass, faCircleCheck, faGavel, faCircle, faXmark, faCheck, faXmarkCircle, faCommentSlash, faScroll, faAngleDown, faGears, faCommentDots, faUserPlus, faUserMinus, faBars } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

const ServerSettings = (
    {selectedServer, setPopup, popup, selected, setSelected, input, setInput, filterMenu, setFilterMenu, access, user }
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
  const [prevImage, setPrevImage] = useState(selectedServer.image);
  const [selectedFile, setSelectedFile] = useState(selectedServer.image);
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [filterLog, setFilterLog] = useState({
    user: "All",
    search: "",
  })
  const [focusRole, setFocusRole] = useState("left");
  const serverSettings = [
    "Overview",
    "Roles",
    "Audit Log",
    "Bans"
  ];
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
    setInput({...input, roleName: role.name, roleColor: role.color, roleAccess: role.access})
  }
  useEffect(() => {
    setSelectedFile(selectedServer.image)
    setPrevImage(selectedServer.image)
    setInput({...input, systemMessages: selectedServer.channels.filter(channel => channel.systemMessages === true)[0]?.name})
    if(selectedPage !== 2){
      selectRole(selectedServer.serverRoles[0])
    }
  },[selectedServer, popup])
  useEffect(()=> {
    if(selectedServer !== null && selectedServer !== undefined && selectedRole !== null && selectedRole !== undefined){
      if(input.serverName !== selectedServer.name 
        || input.roleName !== selectedRole.name 
        || input.roleColor !== selectedRole.color 
        || input.roleAccess !== selectedRole.access
        || selectedFile !== selectedServer.image
        || selectedServer.channels.filter(channel => channel.systemMessages === true && channel.name)[0].name !== input.systemMessages
      ){
        setUnsavedChanges(true)
      }else{
        setUnsavedChanges(false)
      }
    }
  },[input, selectedFile])

  function removeRole(selectedUser){
    socket.emit("addRole", {serverID: selectedServer._id, role: selectedServer.serverRoles[selectedServer.serverRoles.length-1].name, users: [selectedUser.email]})
    // console.log({serverID: selectedServer._id, role: selectedServer.serverRoles[selectedServer.serverRoles.length-1].name, users: [selectedUser.email]})
    socket.emit("addLog", {serverID: selectedServer._id, type: "roleChanges", user: user, messageOwner: selectedUser.email, roleName: selectedServer.serverRoles[selectedServer.serverRoles.length-1].name})
  }
  const saveChanges = (e) => {
    e.preventDefault();
    socket.emit("updateServer", { serverID: selectedServer._id, image: selectedFile, serverName: input.serverName, roleID: selectedRole._id, roleName: input.roleName, roleColor: input.roleColor, roleAccess: input.roleAccess, systemMessages: input.systemMessages})
    if(selectedServer.channels.filter(channel => channel.systemMessages === true)[0]?.name !== input.systemMessages){
      socket.emit("addLog", {serverID: selectedServer._id, type: "systemMessages", user: user, channelName: input.systemMessages})
    }else if(selectedServer.name !== input.serverName){
      socket.emit("addLog", {serverID: selectedServer._id, type: "serverName", user: user, serverName: input.serverName})}
    else if(selectedServer.image !== selectedFile){
      socket.emit("addLog", {serverID: selectedServer._id, type: "serverImage", user: user, serverName: input.serverName})
    }else if(selectedRole.name !== input.roleName || selectedRole.color !== input.roleColor || selectedRole.access !== input.roleAccess){
      socket.emit("addLog", {serverID: selectedServer._id, type: "roleName", user: user, roleName: input.roleName})
    }
    setPopup({...popup, showPopup:false})
    setSelectedPage(0)
    window.innerWidth < 640 ? setSelected({...selected, focus: "left"}) : setSelected({...selected, focus: "all"})
    }
    const resetChanges = (e) => {
      e.preventDefault();
      setPrevImage(selectedServer.image)
      setSelectedFile(selectedServer.image)
      setInput({...input, serverName: selectedServer.name, roleName: selectedRole.name, roleColor: selectedRole.color, roleAccess: selectedRole.access, systemMessages: selectedServer.channels.filter(channel => channel.systemMessages === true)[0]?.name})
    }

    const filterUsers = () => {
      const searchTerm = (input.searchMembers || '').toLowerCase(); // Set default value to empty string if undefined
    
      // Tüm kullanıcıları filtrele
      const filteredUsers = selectedServer.serverUsers.filter(user => {
        const userNameLowerCase = user.name.toLowerCase();
        return userNameLowerCase.includes(searchTerm);
      });
    
      // Filtrelenmiş kullanıcıları göster
      return filteredUsers.map((user, index) => (
        <button
          key={index}
          className={`flex justify-between items-center w-full px-2 py-3 ${
            filterLog.user === user.name ? 'bg-blue-50 text-white' : 'hover:bg-black-50 text-gray-100'
          } rounded-md`}
          onClick={() => {
            setFilterLog({ ...filterLog, user: user.name });
            setFilterMenu({ ...filterMenu, userPopup: false });
          }}
        >
          <span className='flex items-center text-sm gap-2'>
            <img src={user.imageUrl} alt="user" className='w-6 rounded-full' />
            {user.name}
          </span>
          {filterLog.user === user.name && <FontAwesomeIcon icon={faCircleCheck} className='text-sm' />}
        </button>
      ));
    };
    

    const truncateText = (text) => {
      let limit = window.innerWidth < 470 ? 60 : window.innerWidth < 640 ? 90 : 28;
      if (text.length > limit) {
        return text.slice(0, limit) + '...';
      }
      return text;
    };
    function convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        if (!file) {
          console.log('please select an image');
        } else {
          fileReader.readAsDataURL(file);
          fileReader.onload = () => resolve(fileReader.result);
        }
        fileReader.onerror = (error) => reject(error);
      });
    }

    async function fileSelectHandler(e) {
      const base64 = await convertToBase64(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      setPrevImage(base64);
    }

  const showSettingsMenu = () => {
    switch (serverSettings[currentStep]) {
      case "Overview":
        return (
        <div>
          <p className='mb-2 font-bold'>Server Overview</p>
          <div className='divide-y divide-[#46484b] space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 sm:space-x-3'>
              <div className='grid grid-cols-3 space-x-5'>
                <img src={prevImage} alt='server' className='rounded-full w-20 h-20'/>
                <div className='col-span-2 space-y-3'>
                <p className='text-ssm text-gray-100'>We recommend an image of at least 512x512 for the server.</p>
                <div className='text-ssm border border-[#46484b] cursor-pointer rounded-sm'>
                  <input type='file' onChange={fileSelectHandler} className='hidden'/>
                  <p className='px-2 py-1.5' onClick={() =>{ 
                    const fileInput = document.querySelector('input[type="file"]');
                    if(fileInput){
                      fileInput.click();
                    }}}>Upload Image</p>

                </div>
                </div>
              </div>

              <div className='mt-2 sm:-mt-2'>
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
                    value={input.systemMessages}
                    onChange={(e) => setInput({...input, systemMessages: e.target.value})}
                    className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none"
                  >
                    {selectedServer.channels.map((channel, index) => (
                      <option key={index} value={channel.id} onChange={()=> setInput({...input, systemMessages: channel.name})}>
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
      case "Roles":
        return (
          <div className={window.innerWidth < 640 ? 'w-full' : 'w-[500px] -mx-8 grid grid-cols-7'}>
            <div className={`col-span-2 sm:border-r border-r-0 border-[#46484b] px-1.5 ${focusRole === "left" || selected.focus === "all" ? 'flex flex-col':'hidden'}`}>{selectedServer.serverRoles.map((role, index) => (
              <button key={index} onClick={() => {selectRole(role); setFocusRole("center")}} className={`${selectedRole !==null && selectedRole !==undefined && selectedRole.name === role.name ? 'bg-black-focus':'hover:bg-black-hover'} rounded-md px-2 py-1 my-0.5 text-sm gap-2 flex items-center w-full`}><FontAwesomeIcon icon={faCircle} className='w-3' style={{color: role.color}}/>{role.name}</button>
            ))}
            </div>
              <div className={`col-span-5 ${(focusRole === "center" || selected.focus === "all") && 'pl-5'}`}>
              {selectedRole !== null && selectedRole !== undefined && (focusRole === "center" || selected.focus === "all") ? (
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
                      <button className='w-14 h-12 rounded-md border border-[#46484b]' style={{backgroundColor: input.roleColor}}></button>

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
                    <ul className="overflow-auto h-[500px] no-scrollbar">
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
                    <button className='bg-blue-50 hover:bg-blue-200 px-3 py-2 mb-5 text-ssm rounded-sm w-full transition-all' onClick={() => setPopup({...popup, addMembers: true})}>Add Members</button>
                    <div className='flex flex-col overflow-auto h-[500px]'>
                      {selectedServer.serverUsers.map((user, index) => {
                        if(user.roles[0] === selectedRole.name) {
                          return (
                            <div key={index} className='flex justify-between p-2 rounded-md hover:bg-black-50'>
                              <div className='flex gap-2'>
                                <img src={user.imageUrl} alt="user" className='w-6 h-6 rounded-full'/>{user.name}
                              </div>
                              <button onClick={()=> removeRole(user)}><FontAwesomeIcon icon={faXmarkCircle} className='text-gray-200 hover:text-gray-100'/></button>
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
      case "Audit Log":
        return (
          <div className='space-y-3'>
            <div className='flex justify-between border-b border-[#46484b] pb-4 mb-2'>
              <p className='font-bold'>Audit Log</p>
              <div className='flex flex-col'>
                <div className='flex gap-3 text-gray-200 text-ssm'>
                <p>Filter by User<button onClick={() => setFilterMenu({...filterMenu, userPopup: !filterMenu.userPopup})}  className='ml-3'>{filterLog.user} <FontAwesomeIcon icon={faChevronDown}  className='text-white mx-0.5 text-[8px]'/></button></p>
                </div>
              {filterMenu.userPopup && (
              <div className={`bg-black-100 border border-black-50 absolute mt-7 ${window.innerWidth < 640 && 'right-5'} shadow-2xl p-2 h-[210px]`}>
                <div className='flex'>
                <input value={input.searchMembers || ""} type="text" onChange={(e) => setInput({...input, searchMembers:e.target.value})} placeholder='Search Members'
                  className=" px-2 py-2 mb-2 text-sm rounded-l-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none"/>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100 bg-[#1E1F22] py-2.5 px-2 rounded-r-sm'/>
                </div>
                <div className='space-y-1 max-h-[200px] shadow-3xl overflow-auto no-scrollbar'>
                <button className={`flex justify-between items-center w-full px-2 py-3 ${filterLog.user === "All" ? 'bg-blue-50 text-white' : 'hover:bg-black-50 text-gray-100'} rounded-md`} onClick={()=> {setFilterLog({...filterLog, user: "All"}); setFilterMenu({...filterMenu, userPopup: false})}}><span className='flex items-center text-sm gap-2'><FontAwesomeIcon icon={faUserGroup} alt="All user" className='w-6'/>All Users</span> {filterLog.user === "All" && <FontAwesomeIcon icon={faCircleCheck} className='text-sm'/>}</button>
                {input.searchMembers === "" ? (
                  // Eğer input boşsa, tüm kullanıcıları göster
                  selectedServer.serverUsers.map((user, index) => (
                    <button
                      key={index}
                      className={`flex justify-between items-center w-full px-2 py-3 ${
                        filterLog.user === user.name ? 'bg-blue-50 text-white' : 'hover:bg-black-50 text-gray-100'
                      } rounded-md`}
                      onClick={() => {
                        setFilterLog({ ...filterLog, user: user.name });
                        setFilterMenu({ ...filterMenu, userPopup: false });
                      }}
                    >
                      <span className='flex items-center text-sm gap-2'>
                        <img src={user.imageUrl} alt="user" className='w-6 rounded-full' />
                        {user.name}
                      </span>
                      {filterLog.user === user.name && <FontAwesomeIcon icon={faCircleCheck} className='text-sm' />}
                    </button>
                  ))
                ) : (
                  // Eğer input doluysa, filtrelenmiş kullanıcıları göster
                  <>{filterUsers()}</>
                )}
              </div>
              </div>)}
              </div>
            </div>
            
            
            <div className='space-y-2 h-[500px] overflow-auto no-scrollbar'>
              {selectedServer.logs.length !== 0 ?(
                selectedServer.logs.reverse().map((log, index) => (
                  filterLog.user === "All" || log.byWhom.name === filterLog.user ? (
                  
                  <div className='w-full flex items-center text-sm py-1 px-2 gap-2 rounded-md bg-black-200 border border-black-400' key={index}>
                  <FontAwesomeIcon icon={
                    log.type === "messageDelete" ? faCommentSlash : 
                    log.type === "systemMessages" || log.type === "serverName" || log.type === "serverImage" || log.type === "roleName" || log.type === "roleChanges" || log.type === "updateChannel" ? faGears: 
                    log.type === "createChannel" ? faCommentDots :
                    log.type === "ban" || log.type === "kick" ? faUserMinus :
                    log.type === "banRevoke" ? faUserPlus :
                    log.type === "deleteChannel" ? faCommentSlash : null} className='text-gray-100'/>
                  <img src={log.byWhom.imageUrl} alt="byWhom" className='w-7 rounded-full'/>
                  <p className='text-gray-100'>
                  {log.type === "messageDelete" && (
                    <span>
                        {`${log.byWhom.name} deleted `}
                        <span className='text-white'>1 message</span>
                        {` by ${log.toWho} in `}
                        <span className='text-white'>{truncateText(log.channel)}</span>
                      </span>
                    )}
                  {(log.type === "serverName" || log.type === "serverImage") && (
                    <span>
                        <span className='text-white'>{log.byWhom.name} </span>
                        {`changed the server `}
                        {log.type === "serverName" ? `name.` : `image.`}
                      </span>
                    )}
                  {log.type === "roleChanges" && (
                    <span>
                        <span className='text-white'>{log.byWhom.name} </span>
                        {`has updated the role of the person with email `}
                        <span className='text-white'>{log.toWho} </span>
                        {`to `}
                        <span className='text-white'>{log.role}.</span>
                      </span>
                    )}
                  {log.type === "roleName" && (
                    <span>
                        <span className='text-white'>{log.byWhom.name} </span>
                        {`updated the `}
                        <span className='text-white'>{log.role} </span>
                        {`role.`}
                      </span>
                    )}
                  {log.type === "systemMessages" && (
                    <span>
                        <span className='text-white'>{log.byWhom.name} </span>
                        {`set the system messages channel to `}
                        <span className='text-white'>#{truncateText(log.channel)}</span>
                      </span>
                    )}
                    {(log.type === "createChannel" || log.type === "deleteChannel" || log.type === "updateChannel") && (
                      <span>
                          <span className='text-white'>{log.byWhom.name} </span>
                          {log.type === "createChannel" && `created the `}
                          {log.type === "deleteChannel" && `deleted the `}
                          {log.type === "updateChannel" && `updated the `}
                          <span className='text-white'>#{truncateText(log.channel)} </span>
                          {`channel.`}
                        </span>
                      )}
                    {(log.type === "ban" || log.type === "kick" || log.type === "banRevoke") && (
                      <span>
                          <span className='text-white'>{log.byWhom.name} </span>
                          {log.type==="ban" && `banned `}
                          {log.type==="kick" && `kicked `}
                          {log.type==="banRevoke" && `revoke the ban of `}
                          <span className='text-white'>{log.toWho}</span>
                        </span>
                      )}
                  </p>
                  </div>
                  ):null))
              ): <div className='flex flex-col items-center justify-center text-center h-[300px] text-gray-200'>
                <FontAwesomeIcon icon={faScroll} className='text-6xl mb-5'/>
                <p className='font-semibold'>NO LOGS YET</p>
                <p className='w-80 leading-5 my-2'>Once moderators begin moderating, you can moderate the moderation here.</p>
                </div>}
            </div>
          </div>)
      case "Bans":
        return (
          <div className='space-y-3'>
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
            {selectedServer.bans.length === 0 ?
            <div className='flex flex-col items-center justify-center rounded-md text-sm text-gray-200 border border-black-300 border-b-2 shadow-3xl h-[400px] space-y-2'>
              <FontAwesomeIcon icon={faGavel} className='text-6xl mb-10'/>
              <p className='font-bold text-gray-100'>NO BANS</p>
              <p className='w-64'>You haven't banned anybody... but if and when you must, do not hesitate!</p>
            </div>
            :
            <div className='flex flex-col items-center p-3 rounded-md text-sm text-gray-200 border border-black-300 border-b-2 shadow-3xl h-[400px] overflow-auto no-scrollbar space-y-0.5'>
            {selectedServer.bans.map((ban, index) => (
              <button onClick={()=> setFilterMenu({...filterMenu, banPopup: true, selectedUser: ban.user, reason: ban.reason, banID: ban._id})} key={index} className='flex justify-between items-center w-full px-2 py-3 text-gray-100 bg-[#3F4147] hover:bg-black-50 rounded-md'><span className='flex items-center text-ssm gap-2'><img src={ban.user.imageUrl} alt="user" className='w-6 rounded-full'/> {ban.user.name}</span></button>
              ))}
            </div>
            }
            
          </div>)
      default:
        return true;
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex text-white text-left bg-[#313338]">
                <div className={`bg-[#2B2D31] ${selected.focus === "left" || selected.focus === "all" ? 'flex flex-col': 'hidden'} ${window.innerWidth < 640 ? 'w-[100%] items-start': 'w-[50%] items-end'} text-left px-2 divide-y divide-[#46484b] space-y-3`}>
                    <ul className={`${selected.focus === "left" || selected.focus ==="all" ? (window.innerWidth < 640 ? 'w-full' : 'w-40') : 'hidden'} text-sm text-gray-100 pt-5`}>
                      <p className='flex p-1 text-ssm font-bold'>{truncateText(selectedServer.name)}</p>
                      {serverSettings.map((step, index) => (
                        <div key={index}>
                          {(index === 2 && access.manageServer) || (index === 2 && selectedServer.owner === user.email) ? (
                            <span>
                              <div className='border-t border-[#46484b] my-2'></div>
                              <p className='flex p-1 text-ssm font-bold'>MODERATION</p>
                            </span>
                          ):null}
                          {step === "Overview" && (
                            <li key={index} onClick={() => {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep === index ? 'text-white bg-black-focus' : 'hover:bg-black-hover'}`}>{step}</li>
                          )}
                          {step === "Roles" && (access.manageRoles || selectedServer.owner === user.email ? (
                            <li key={index} onClick={() => {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep === index ? 'text-white bg-black-focus' : 'hover:bg-black-hover'}`}>{step}</li>
                          ) : null)}
                          {step === "Audit Log" && (access.manageServer || selectedServer.owner === user.email ? (
                            <li key={index} onClick={() => {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep === index ? 'text-white bg-black-focus' : 'hover:bg-black-hover'}`}>{step}</li>
                          ) : null)}
                          {step === "Bans" && (access.manageUsers || selectedServer.owner === user.email ? (
                            <li key={index} onClick={() => {setCurrentStep(index); setSelected({...selected, focus: window.innerWidth < 640 ? "center" : "all"})}} className={`p-1 my-0.5 cursor-pointer rounded-md ${currentStep === index ? 'text-white bg-black-focus' : 'hover:bg-black-hover'}`}>{step}</li>
                          ) : null)}
                        </div>
                      ))}
                    </ul>
                </div>        

          <div className={`${selected.focus === "center" || selected.focus === "all" ? 'flex': 'hidden'} ${window.innerWidth > 750 && 'pt-5 mx-8 space-x-8'} flex-col w-full relative`}>
            <div className={`text-3xl text-gray-200 items-center ${window.innerWidth < 750 ? 'justify-between px-8 max-w-[750px]' : 'justify-end ml-12 max-w-[600px]'} flex my-5`}>
              <button className={`hover:text-gray-100 cursor-pointer relative right-0 ${window.innerWidth > 750 && 'hidden'}`} onClick={()=> {setSelected({...selected, focus: 'left'}); setFocusRole("left")}}><FontAwesomeIcon icon={faBars} /></button>
              <button className={`hover:text-gray-100 cursor-pointer relative right-0 `} onClick={()=> {setPopup({...popup, serverSettings: false, showPopup: false}); setSelected({...selected, focus: window.innerWidth < 640 ? 'left' : 'all'})}}><FontAwesomeIcon icon={faCircleXmark} /></button>
             </div>
              <div className="sm:w-[500px] px-8">
                {showSettingsMenu()}
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
      </div> 
  )
}

export default ServerSettings