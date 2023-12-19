import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { io } from "socket.io-client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHashtag, faVolumeHigh, faArrowRightFromBracket, faX, faGear, faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Channels = (params) => {
  const {selected, selectedServer, setSelected,setData, user} = params
  const [popup, setPopup] = React.useState({
    serverInfo: false,
    invite: false,
    leave: false
  })
  const [text, setText] = React.useState('Copy')

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);
  }, []);

  
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
                <li className="hover:bg-blue cursor-pointer text-gray-100 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Server Settings <FontAwesomeIcon icon={faGear} /></li>
                <li onClick={()=> setPopup({...popup, invite:true})} className="hover:bg-blue-50 cursor-pointer text-blue-50 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Invite People <FontAwesomeIcon icon={faUserPlus} /></li>
                <li onClick={()=> leaveServer()}className="hover:bg-red-500 cursor-pointer text-red-500 hover:text-white p-1 px-2 text-sm justify-between flex items-center rounded-sm">Leave Server <FontAwesomeIcon icon={faArrowRightFromBracket} /></li>
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
    </div>
  )
}

export default Channels