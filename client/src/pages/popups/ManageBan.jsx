import React, {useEffect, useState} from 'react'
import {io} from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
const ManageBan = ({popup, setPopup, selectedServer, user, input, setInput }) => {
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
        const socket = io(process.env.REACT_APP_SERVER);
        setSocket(socket);
        return () => {
            socket.disconnect();
        };
        
    }, [selectedServer])

    const [filterLog, setFilterLog] = useState({
        user: "All",
        search: "",
    })
    const [ban, setBan] = useState({
        user: filterLog.user,
        reason: "",
    })
    useEffect(() => {
        setBan({...ban, user: filterLog.user}) // eslint-disable-next-line
    }, [filterLog.user]);
    const filterUsers = () => {
        const searchTerm = (input.searchMembers || '').toLowerCase(); // Set default value to empty string if undefined
      
        const filteredUsers = selectedServer.serverUsers.filter(user => {
          const userNameLowerCase = user.name.toLowerCase();
          return userNameLowerCase.includes(searchTerm);
        });
      
        return filteredUsers.map((user, index) => (
          <button
            key={index}
            className="flex justify-between items-center w-full px-2 py-3'hover:bg-black-50 text-gray-100 rounded-md"
            onClick={() => {
              setFilterLog({ ...filterLog, user: user });
            }}
          >
            <span className='flex items-center text-sm gap-2'>
              <img src={user.imageUrl} alt="user" className='w-6 rounded-full' />
              {user.name}
            </span>
          </button>
        ));
      };

    function addBan(params){
        let systemMessages = selectedServer.channels.filter(channel => channel.systemMessages === true)
        socket.emit("sendMessage", { serverID: selectedServer._id, channelID: systemMessages[0]._id, messageType: 'leaveServer', message: `${params.ban ? 'banned':'kicked'} by ${params.byWhom.name}.`, user: params.toWho });
        socket.emit("addBan", {ban: params, log: { serverID: selectedServer._id, messageOwner: params.toWho, user: params.byWhom, type: 'ban' }})
        // socket.emit("addLog", {serverID: selectedServer._id, type: "ban", user: params.toWho, messageOwner: params.byWhom, reason: params.reason})
        if(popup.manageBan || popup.showPopup){
            setPopup({...popup, manageBan: false, showPopup: false})
        }
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPopup({...popup, manageBan: false, showPopup: false})}>
        <div className="relative bg-[#313338] rounded-md shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
        {filterLog.user === "All" ? (
            <div className='bg-black-100 border border-black-50 rounded-md shadow-2xl p-2 h-[210px]'>
                <div className='flex'>
                <input value={input.searchMembers || ""} type="text" onChange={(e) => setInput({...input, searchMembers:e.target.value})} placeholder='Search Members'
                    className=" px-2 py-2 mb-2 text-sm rounded-l-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none"/>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-100 bg-[#1E1F22] py-2.5 px-2 rounded-r-sm'/>
                </div>
                <div className='space-y-1 max-h-[200px] shadow-3xl overflow-auto no-scrollbar'>
                {
                input.searchMembers === "" ? (
                    selectedServer.serverUsers
                    .filter(user => user.email !== selectedServer.owner)
                    .map((user, index) => (
                        <button
                        key={index}
                        className="flex justify-between items-center w-full px-2 py-3 hover:bg-black-50 text-gray-100 rounded-md"
                        onClick={() => {
                            setFilterLog({ ...filterLog, user: user });
                        }}
                        >
                        <span className='flex items-center text-sm gap-2'>
                            <img src={user.imageUrl} alt="user" className='w-6 rounded-full' />
                            {user.name}
                        </span>
                        </button>
                    ))
                ) : (
                    <>{filterUsers()}</>
                )}
                </div>
            </div>
        ):(
            <div className="text-left sm:w-96">
                <div className='p-4'>
                <p className='text-lg text-white'>Kick/Ban {filterLog.user.name} from server</p>
                <p className='text-gray-100 text-sm my-2'>Are you sure you want to kick/ban @{filterLog.user.name} from the server?</p>
                <div className='flex flex-col text-left text-ssm text-gray-100'>
                    <label htmlFor="Server name" className="block text-ssm font-bold leading-6 text-gray-100">
                    REASON FOR KICK/BAN
                    </label>
                    <input type="text" className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" value={ban.reason} onChange={(e)=> setBan({...ban, reason: e.target.value})}/>
                </div>
                </div>
                <div className='justify-between flex p-4 rounded-b-md bg-black-200'>
                    <button className='text-gray-50 hover:underline text-ssm' onClick={()=> setPopup({...popup, manageBan: false, showPopup: false})}>Cancel</button>
                <div className='space-x-2'>
                <button onClick={() => addBan({serverID: selectedServer._id, ban:false, toWho: ban.user, byWhom: user, reason: ban.reason})} className='text-white text-ssm px-5 py-2 rounded-sm bg-blue-50 hover:bg-blue-200'>Kick</button>
                <button onClick={() => addBan({serverID: selectedServer._id, ban:true, toWho: ban.user, byWhom: user, reason: ban.reason})} className='text-white text-ssm px-5 py-2 rounded-sm bg-red-500 hover:bg-red-700 transition-all'>Ban</button>
                </div>
                </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default ManageBan