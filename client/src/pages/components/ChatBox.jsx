import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faArrowRightLong, faPlus, faTrash, faCrown  } from '@fortawesome/free-solid-svg-icons'
import { io } from "socket.io-client";
import { MobileNavigation } from './MobileNavigation';
// fix that path later
import img from './../../static/lost.svg';

const ChatBox = (params) => {
  const { selected, setSelected, selectedServer, setServer, access, popup, setPopup, user} = params
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [prevImage, setPrevImage] = useState(null)
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
    socket.on("updateServer", (data)=> {
        setServer(data.server);
        setSelectedChannel(data.server.channels.find(channel => channel._id === selected.channelID))
    })
    return () => {
      socket.disconnect();
    };// eslint-disable-next-line
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
    }// eslint-disable-next-line
  }, [selectedChannel]);


  const sendMessage = (event) => {
    event.preventDefault();
    let user = selectedServer.serverUsers.find(u => u.name === params.user.name)
    if(message === "/ban" && (access.manageUsers || selectedServer.owner === user.email)){
      setMessage("");
      setPopup({...popup, showPopup: true, manageBan: true})
    }else{
      if (message !== "" && socket) {
        socket.emit("sendMessage", { serverID: selected.serverID, channelID: selected.channelID, messageType: 'Message', message: message, user: user, file: selectedFile });
        setMessage("");
        setSelectedFile(null);
        setPrevImage(null);
      }
    }
  };
  const removeMessage = (msg) => {
    socket.emit("removeMessage", { message: msg,  channelID: selectedChannel._id, deletedBy: params.user });
    if(msg.user.email !== params.user.email){
      socket.emit("addLog", { serverID: selected.serverID, channelName: `#${selectedChannel.name}`, messageOwner: msg.user.name, user: params.user, type: 'messageDelete' })
    }
  }

  async function fileSelectHandler(e){
    const base64 = await convertToBase64(e.target.files[0])
    setSelectedFile(e.target.files[0])
    setPrevImage(base64)
  }

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if(!file){
        console.log('please select a image')
      }else{
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
      }
      fileReader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className={`${selected.serverID !== null && selectedServer !== "" ? 'w-[100%]':'w-[90%]'} ${selected.focus === "all" || selected.focus === "center"  ? 'flex': 'hidden'} h-screen text-sm bg-black-100`}>
      {selectedChannel !== null && selectedChannel !== undefined && selectedServer !== undefined && selectedServer.channels != null && selected.serverID != null? (
        <div className='flex-col flex justify-between relative w-full'>
          <MobileNavigation selected={selected} setSelected={setSelected} selectedServer={selectedServer}/>
          <ul ref={chatAreaRef} className={`overflow-auto ${window.innerWidth < 640 ? 'mt-14': null}`}>
            {selectedChannel.messages.map((msg, index) => (
              <div key={index} className='flex space-x-5 m-5 p-2 rounded-xl items-center break-words relative group hover:bg-black-200'>
                {msg.messageType === 'Message' ? (
                  <>
                    <img src={msg.user.imageUrl} alt="" className='w-8 h-8 rounded-full absolute top-2.5' />
                    <div>
                      <div className='px-5'>
                        <p style={{ color: `${selectedServer.serverRoles && selectedServer.serverRoles.find(role => role.name === msg.user.roles[0]).color}` }}>{msg.user.name} {selectedServer.owner === msg.user.email && <FontAwesomeIcon icon={faCrown} className='text-orange-400'/>}</p>
                        <p className='text-slate-100 text-xs text-wrap break-words max-w-[1350px]'>{msg.message}</p>
                      </div>
                      {msg.file && (
                        <img src={msg.file} alt='file' className='px-5 py-2 w-96'/>
                        )}
                    </div>
                  </>
                    ):(
                      <div className='flex gap-2 items-center'>
                        {msg.messageType === 'joinServer' ? (
                        <FontAwesomeIcon icon={faArrowRightLong} className='text-green-600'/>
                        ):(<FontAwesomeIcon icon={faArrowLeftLong} className='text-red-600'/>)}
                        <p style={{ color: `${selectedServer.serverRoles && selectedServer.serverRoles.find(role => role.name === msg.user.roles[0]).color}` }}>{msg.user.name}</p>
                        <p className='text-gray-100 text-xs text-wrap break-words max-w-[1350px]'>{msg.message}</p>
                      </div>
                    )}
                {msg.user.email === params.user.email || access.manageMessages ? (
                  <div className='-top-3 right-5 absolute bg-black-100 rounded-md border-2 shadow-3xl border-black-200 hidden group-hover:flex overflow-auto'>
                    <button onClick={()=> removeMessage(msg)} className='p-2 hover:bg-[#38393d]'><FontAwesomeIcon icon={faTrash} className='text-red-500 text-xs' /></button>
                  </div>
                  ): null}
              </div>
            ))}
          </ul>
            <form onSubmit={sendMessage} className={`p-1 mb-4 mx-3 flex flex-col rounded-lg ${selectedServer.owner === user.email || access.manageChannels || selectedChannel.access.write.includes(selectedServer.serverUsers.find(u => u.email === params.user.email).roles[0]) ? 'bg-black-50' : 'bg-black-200 cursor-not-allowed'}`}>
            {prevImage && (
              <div className='flex items-start w-fit p-2'>
                <img src={prevImage} alt='prev' className='w-52 rounded-md p-2 pt-7 bg-black-200'/>
                <span type='text' onClick={()=> {setPrevImage(null); setSelectedFile(null)}} className='p-1 relative right-3 -top-2 bg-black-50 hover:bg-black-200 hover:cursor-pointer border border-black-200'><FontAwesomeIcon icon={faTrash} className='text-red-500 text-xs' /></span>
              </div>
              )}

            <div className='flex'>
              <div className='flex items-center justify-center m-2 px-4 py-2'>
                  <input type='file' className='hidden' onChange={fileSelectHandler}/> 
                  <FontAwesomeIcon icon={faPlus} 
                  // eslint-disable-next-line
                  className={`w-3.5 h-3.5 fixed text-sm p-1 mx-2 flex items-center justify-center rounded-full ${(selectedServer.owner === user.email || access.manageChannels || selectedChannel.access.write.includes( selectedServer.serverUsers.find((u) => u.email === params.user.email)                 .roles[0]         )) ? 'text-black-50 bg-gray-100 cursor-pointer' : 'text-black-100 bg-gray-200 cursor-not-allowed' }`} 
                  onClick={() =>{ 
                    const fileInput = document.querySelector('input[type="file"]');
                    if(fileInput){
                      fileInput.click();
                    }}}/>
              </div>
                { selectedServer.owner === user.email || access.manageChannels || selectedChannel.access.write.includes(selectedServer.serverUsers.find(u => u.email === params.user.email).roles[0]) ? (
                  <>
                  <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} className=' bg-black-50 border-0 text-sm focus:ring-0 p-1 focus:outline-none overflow-auto w-full text-white truncate' placeholder={`Message #${selectedChannel.name}`} />
                  </>
                  ):(
                    <input type="text" value={message}  className=' bg-black-200 border-0 text-sm focus:ring-0 p-1 focus:outline-none overflow-auto w-full text-white truncate cursor-not-allowed' placeholder="You do not have permission to send messages in this channel." readOnly/>
                    )}
            </div>
            </form>
        </div>
      ) : 
      <div className='flex flex-col justify-center items-center w-full h-full text-gray-200 gap-5'>
        <img src={img} alt="" className='w-64'/>
        There is noting here...
      </div>}
    </div>
  );
}

export default ChatBox
