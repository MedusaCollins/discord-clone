import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { io } from "socket.io-client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh, faArrowRightFromBracket, faX, faGear, faUserPlus, faPlus } from '@fortawesome/free-solid-svg-icons'

const Channels = ({selected, selectedServer, setLogin, setSelected, setData, user, popup, setPopup, access, input, setInput}) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);
  }, []);
  useEffect(() => {
    setInput({...input, serverName: selectedServer.name}) // eslint-disable-next-line 
  }, [selectedServer])

  async function leaveServer() {
    selectedServer.serverUsers.map((selectedUser) => {
      if (selectedUser.email === user.email) {
        let systemMessages = selectedServer.channels.filter(channel => channel.systemMessages === true)
        socket.emit("sendMessage", { serverID: selectedServer._id, channelID: systemMessages[0]._id, messageType: 'leaveServer', message: 'just left the server.', user: selectedUser });
        axios.post(`${process.env.REACT_APP_SERVER}/leaveServer`, { serverID: selectedServer._id, user: selectedUser }).then((res) => {
          setData(res.data);
          setSelected({ serverID: null, channelID: null });
          socket.emit('leaveServer', { serverID: selectedServer._id });
        });
      }
      return null;
    });
  }
  async function deleteServer(){
    socket.emit('deleteServer', { serverID: selectedServer._id });
  }
  function openServerSettings(params){
    setPopup({...popup, channelSettings: true, showPopup: true, channelInfo: params})
    setInput({...input, selectedChannel: selectedServer.channels.filter(channel => channel._id === params._id)[0]})
  }

  return (
    <div className="w-[10%] h-screen bg-black-200 text-white flex flex-col relative justify-between">
      {selectedServer.channels != null && selected.serverID != null && selectedServer.serverUsers.find(selectedUser => selectedUser.email === user.email) ?
        <div>
          <button onClick={() => popup.serverInfo ? setPopup({...popup, serverInfo:false}): setPopup({...popup, serverInfo:true})} className='justify-between items-center flex px-5 py-2 w-full hover:bg-black-hover cursor-pointer transition-all'>{selectedServer.name} 
            <span className='text-sm text-gray-100'><FontAwesomeIcon icon={popup.serverInfo ? faX : faAngleDown} /></span>
          </button>
          {popup.serverInfo && (
            <div className='bg-black-400 absolute w-[90%] m-2 rounded-md'>
              <ul className='p-2'>
                <li onClick={()=> setPopup({...popup, serverInvite:true,serverInfo:false, showPopup:true})} className="hover:bg-blue-50 cursor-pointer text-blue-50 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Invite People <FontAwesomeIcon icon={faUserPlus} /></li>
                {access.manageServer || access.manageChannels || selectedServer.owner === user.email ? 
                  <li className='border-b-2 border-[#2e2f31] my-1'></li>:null}
                {access.manageServer || selectedServer.owner === user.email ? 
                  <li onClick={()=> setPopup({...popup, serverSettings:true, serverInfo:false, showPopup: true})} className="hover:bg-blue cursor-pointer text-gray-100 hover:text-white hover:bg-blue-50 p-1 px-2 text-sm justify-between flex items-center rounded-sm">Server Settings <FontAwesomeIcon icon={faGear} /></li>:null}
                {access.manageChannels || selectedServer.owner === user.email ? 
                  <li onClick={()=> setPopup({...popup, createChannel:true, serverInfo:false, showPopup: true})} className="hover:bg-blue cursor-pointer text-gray-100 hover:text-white hover:bg-blue-50 p-1 px-2 text-sm justify-between flex items-center rounded-sm">Create Channel <FontAwesomeIcon icon={faPlus} /></li>:null}
                {access.manageServer || access.manageChannels || selectedServer.owner === user.email ? 
                  <li className='border-b-2 border-[#2e2f31] my-1'></li>:null}
                {selectedServer.owner === user.email ? <li onClick={()=> deleteServer()} className="hover:bg-red-500 cursor-pointer text-red-500 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Delete Server <FontAwesomeIcon icon={faArrowRightFromBracket} /></li>
                : <li onClick={()=> leaveServer()} className="hover:bg-red-500 cursor-pointer text-red-500 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Leave Server <FontAwesomeIcon icon={faArrowRightFromBracket} /></li>
                }
              </ul>
            </div>
          )}

          {selectedServer.channels.map((channel,index) => {
            if(selectedServer.owner === user.email || access.manageChannels || (channel.access.read).includes(selectedServer.serverUsers.find(u => u.email === user.email).roles[0])){
            return(
              <div key={index} onClick={() => (selected.channelID!==channel._id ? setSelected({...selected, channelID:channel._id}) : null)} 
              className={`flex items-center group h-7 mx-2 my-1 px-2 cursor-pointer rounded-md transition-all
              ${selected.channelID===channel._id ? 'bg-black-focus' :'hover:bg-black-hover'}`}>
                <span className='text-sm text-[#80848E] flex gap-5 items-center'>
                  {channel.type==='Text' ? <FontAwesomeIcon icon={faHashtag} className='mx-0.5'/> :
                  <FontAwesomeIcon icon={faVolumeHigh} />} <span className={`${selected.channelID===channel._id ? 'text-white' :''}`} >{channel.name}</span>
                </span>
                { selectedServer.owner === user.email || access.manageChannels ?
                  <FontAwesomeIcon icon={faGear} className='right-5 absolute hidden group-hover:block text-sm text-gray-100 hover:text-gray-50 col-span-1' onClick={() => openServerSettings(channel)}/>:null}
              </div>
            )}
          })}
              </div>:
        <div className='absolute w-full top-1 h-10 flex flex-col items-center '>
          <button type="text" className="px-2 py-1 mx-2 w-[90%] text-ssm text-left text-gray-400 rounded-sm bg-[#1E1F22] border-0 ring-0 outline-none resize-none" >Start a conversation</button>
          <div className='mt-2 w-full'>
          </div>
        </div>
      }
      <div className='bg-black-300 absolute bottom-0 w-full h-10 flex items-center'>
        <img src={user.imageUrl} alt="" className='w-6 h-6 rounded-full mx-2'/>
        <p className='text-sm'>{user.name}</p>
        <button onClick={()=> setLogin(false)} className='right-2 absolute'><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
      </div>
    </div>
  )}

export default Channels