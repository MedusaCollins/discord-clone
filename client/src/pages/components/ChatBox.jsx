import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { io } from "socket.io-client";

const ChatBox = (params) => {
  const { selected, selectedServer, setServer, access} = params
  const [selectedChannel, setSelectedChannel] = useState(null)
  useEffect(() => {
    if (selectedServer !== "" && selected.channelID !== null) {
      setSelectedChannel(selectedServer.channels.find(channel => channel._id === selected.channelID))
    }
  }, [selectedServer, selected]);

  
  const chatAreaRef = useRef(null);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER);
    setSocket(socket);
    socket.on("getMessage", (data) => {
      if (data.server._id === selectedServer._id){
        setServer(data.server)
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [setServer, selectedServer]);
  useEffect(() => {
    if (chatAreaRef.current) {
      const chatArea = chatAreaRef.current;
      const isScrolledToBottom =
        chatArea.scrollHeight - chatArea.clientHeight <= chatArea.scrollTop + 1;
      chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
      if (!isScrolledToBottom) {
        chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
      }
    }
  }, [selectedChannel]);

  const sendMessage = (event) => {
    event.preventDefault();
    let user = selectedServer.serverUsers.find(u => u.name === params.user.name)
    if (message !== "" && socket) {
      socket.emit("sendMessage", { serverID: selected.serverID, channelID: selected.channelID, text: message, user });
      setMessage("");
    }
  };
  const removeMessage = (msg) => {
    socket.emit("removeMessage", { message: msg, channelID: selectedChannel._id, deletedBy: params.user });
  }

  return (
    <div className="w-[80%] h-screen text-sm flex bg-black-100">
      {selectedChannel !== null && selectedChannel !== undefined && selectedServer !== undefined && selectedServer.channels != null? (
        <div className='flex flex-col justify-between relative w-full'>
          <ul ref={chatAreaRef} className='overflow-auto'>
            {selectedChannel.messages.map((msg, index) => (
              <div key={index} className='flex space-x-5 m-5 p-2 rounded-xl items-center break-words relative group hover:bg-black-200'>
                  <img src={msg.user.imageUrl} alt="" className='w-8 h-8 rounded-full absolute top-2.5' />
                  <div className='px-5'>
                    <p style={{ color: `${selectedServer.serverRoles && selectedServer.serverRoles.find(role => role.name === msg.user.roles[0]).color}` }}>{msg.user.name}</p>
                    <p className='text-slate-100 text-xs text-wrap break-words max-w-[1350px]'>{msg.message}</p>
                  </div>
                {msg.user.email === params.user.email || access.manageMessages ? (
                  <div className='-top-3 right-5 absolute bg-black-100 rounded-md border-2 shadow-3xl border-black-200 hidden group-hover:flex overflow-auto'>
                    <button onClick={()=> removeMessage(msg)} className='p-2 hover:bg-[#38393d]'><FontAwesomeIcon icon={faTrash} className='text-red-500 text-xs' /></button>
                  </div>
                  ): null}
              </div>
            ))}
          </ul>
            <form onSubmit={sendMessage} className='p-1 mb-4 mx-3 bg-black-50 flex items-center justify-center rounded-lg'>
              <button className='bg-gray-100 text-black-50 w-4 h-4 text-sm p-1 mx-2 flex items-center justify-center rounded-full'><FontAwesomeIcon icon={faPlus} /></button>
              <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} className=' bg-black-50 border-0 text-sm focus:ring-0 p-1 focus:outline-none overflow-auto w-full text-white truncate' placeholder={`${selectedChannel.name} kanalına mesaj gönder`} />
            </form>
        </div>
      ) : <div className='flex flex-col justify-center items-center w-full h-full'></div>}
    </div>
  );
}

export default ChatBox