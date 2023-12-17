import React, { useState, useEffect, useRef } from 'react'
import data from './Data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { io } from "socket.io-client";

const ChatBox = (params) => {
  const { selected } = params

  const selectedServer = data.find(server => server.serverID === selected.serverID);
  const selectedChannel = selectedServer.channels.find(channel => channel.channelID === selected.channelID);

  const chatAreaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
      const socket = io(process.env.REACT_APP_SERVER);
      setSocket(socket);
      socket.on("message", (data) => {
          setMessages((messages) => [...messages, data]);
      });
      return () => {
          socket.disconnect();
      };
  }, []);

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
  }, [messages]);

    const sendMessage = (event) => {
      event.preventDefault();
      let user = selectedServer.serverUsers.find(u => u.name === params.user.name)
      if (message !== "" && socket) {
        socket.emit("chat message", {serverID:selected.serverID, channelID:selected.channelID, text: message, user });
        setMessage("");
      }
    };

  return (
      <div className="w-[80%] h-screen text-sm flex  bg-black-100">
        {selected.serverID !== null && selected.channelID !== null ? (
          <div className='flex flex-col justify-between w-full'>
            <ul ref={chatAreaRef}>
              {selectedChannel.messages.map((msg,index) => (
                <div key={index} className='flex space-x-5 m-5 p-2 rounded-xl items-center hover:bg-black-200'>
                  <img src={msg.user.imageUrl} alt="" className='w-8 h-8 rounded-full'/>
                  <div>
                    <p style={{ color: `${selectedServer.serverRoles.find(role => role.name === msg.user.roles[0]).color}` }}>{msg.user.name}</p>
                    <p className='text-slate-100 text-xs'>{msg.message}</p>
                  </div>
                </div>
              ))}
            </ul>

            <form onSubmit={sendMessage} className='p-1 my-4 mx-3 bg-black-50 flex items-center justify-center rounded-lg'>
              <button className='bg-gray-100 text-black-50 w-4 h-4 text-sm p-1 mx-2 flex items-center justify-center rounded-full'><FontAwesomeIcon icon={faPlus}/></button>
              <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} className=' bg-black-50 border-0 text-sm focus:ring-0 p-1 focus:outline-none overflow-auto w-full text-white truncate' placeholder={`${selectedChannel.name} kanalına mesaj gönder`}/>
            </form>
          </div>
         ): null} 
      </div>
  );
}

export default ChatBox