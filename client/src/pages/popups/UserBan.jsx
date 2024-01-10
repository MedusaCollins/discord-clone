import React from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'

const UserBan = ({filterMenu, setFilterMenu, selectedServer, popup ,setPopup }) => {
  const [socket, setSocket] = React.useState(null);
  React.useEffect(()=>{
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);
    return () => {
        socket.disconnect();
    };
  }, [selectedServer])
  function revokeBan(){
    axios.post(`${process.env.REACT_APP_SERVER}/revokeBan`, {serverID: selectedServer._id, banID: filterMenu.banID})
    .then(res => {
      setFilterMenu({...filterMenu, banPopup: false, showPopup: false})
      setPopup({...popup, showPopup:false, serverSettings:false})
      socket.emit("addLog", { serverID: selectedServer._id, messageOwner: res.data.user.name, user: res.data.byWhom, type: 'banRevoke' })
    })
    .catch(err => {
      console.log(err)
    })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => setFilterMenu({...filterMenu, banPopup: false, showPopup: false})}>
      <div className="relative bg-[#313338] rounded-md shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-center sm:w-96">
            <div className='p-4'>
              <p className='text-2xl text-white'>{filterMenu.selectedUser.name}</p>
              <div className='flex flex-col text-left text-ssm text-gray-100'>
                <label htmlFor="Server name" className="block text-ssm font-bold leading-6 text-gray-100">
                  BAN REASON
                </label>
                <p>{filterMenu.reason.length !== 0 ? filterMenu.reason : "No reason provided."}</p>
              </div>
            </div>
            <div className='justify-between flex p-4 rounded-b-xl bg-black-200'>
              <button onClick={() => setFilterMenu({...filterMenu, banPopup: false, showPopup: false})} className='text-white text-ssm px-5 py-2 rounded-sm bg-blue-50 hover:bg-blue-200'>Done</button>
              <button onClick={() => revokeBan()} className='text-red-400 hover:underline text-ssm'>Revoke Ban</button>
            </div>
        </div>
      </div>
      </div>
  )
}

export default UserBan