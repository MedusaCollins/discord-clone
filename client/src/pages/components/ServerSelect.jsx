import React, {useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faChevronRight} from '@fortawesome/free-solid-svg-icons'

const ServerSelect = (params) => {
  const [data, setData] = [params.data, params.setData]
  const [popup, setPopup] = useState({
    createServer: false,
    joinServer: false,
    section: 1
  });
  const [input, setInput] = useState({
    createServer: `${params.user.name}'s Server`,
    joinServer: '',
    errorHandler: ''
  })
  async function createServer(event) {
    event.preventDefault();
    setInput('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/createServer`, { serverName: input.createServer, user: params.user });
      setData([...data, res.data]);
      setInput('');
      setPopup({...popup,joinServer: false, createServer:false, section: 1});
    } catch (err) {
      console.log(err);
    }
  }

  async function joinServer(event) {
    event.preventDefault();
    setInput('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/joinServer`, { serverID: input.joinServer, user: params.user });
      console.log(res.data)
      if(res.data.Error){
        setInput({...input, errorHandler: res.data.Error})
      }
      else{
        setData([...data, res.data]);
        setInput('');
        setPopup({...popup, joinServer: false, createServer:false, section: 1});
      }
    } catch (err) {
      console.log(err);
    }
  }
  function popupSection(){
    if(popup.section === 1){
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => setPopup({...popup, createServer: false})}>
          <div className="relative bg-[#313338] rounded-xl shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center sm:w-96">
                <div className='p-4'>
                  <p className='text-2xl text-white font-semibold'>Create a server</p>
                  <p className='text-sm text-gray-200 mb-2'>Your server is where you and your friend hang out. Make yours and start talking.</p>
                  <div className='text-left space-y-2'>
                    <button onClick={()=> setPopup({...popup, section:3})} className="border rounded-md border-[#4E5058] hover:bg-[#3a3c41] p-2 pr-4 text-white flex items-center w-full">
                      <img className="w-16 -ml-2" src={process.env.REACT_APP_IMG} alt="test" />Create My Own
                      <FontAwesomeIcon icon={faChevronRight} className='ml-auto text-gray-200'/>
                    </button>
                    <button onClick={()=> setPopup({...popup, section:2})} className="border rounded-md border-[#4E5058] hover:bg-[#3a3c41] p-2 pr-4 text-white flex items-center w-full">
                      <img className="w-16 -ml-2" src={process.env.REACT_APP_IMG} alt="test" />Join A Server
                      <FontAwesomeIcon icon={faChevronRight} className='ml-auto text-gray-200'/>
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      );
    }else if(popup.section === 2){
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => {
          setPopup({...popup, createServer: false, section:1});
          setInput({...input, errorHandler: '', joinServer: ''});
        }}>
          <div className="relative bg-[#313338] rounded-xl shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center sm:w-96">
              <form onSubmit={joinServer}>
                <div className='p-4'>
                  <p className='text-2xl text-white font-semibold'>Join a Server</p>
                  <p className='text-sm text-gray-200 mb-2'>Enter an invite link below to join an existing server</p>
                  <div className='flex flex-col text-left'>
                    <label htmlFor="invite link" className="block text-ssm font-bold leading-6 text-gray-100">
                      INVITE LINK <span className='text-red-500'>*</span>
                    </label>
                    <div className="my-2">
                      <input value={input.joinServer} onChange={(e) => setInput({...input, joinServer:e.target.value})} type="text" required
                      className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                      <p className='text-sm text-red-500 right-5 mt-1 absolute'>{input.errorHandler}</p>
                    </div>
                  </div>
                </div>
                <div className='justify-between flex p-4 rounded-b-xl bg-black-200'>
                  <button onClick={()=> {setPopup({...popup, section:1});setInput({...input, errorHandler: '', joinServer: ''});}} className='text-white text-ssm'>Back</button>
                  <button className='text-white text-ssm px-5 py-2 rounded-sm bg-blue-50 '>Join</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else if(popup.section === 3){
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => setPopup({...popup, createServer: false, section:1})}>
          <div className="relative bg-[#313338] rounded-xl shadow-md mx-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center sm:w-96">
              <form onSubmit={createServer}>
                <div className='p-4'>
                  <p className='text-2xl text-white font-semibold'>Customize your server</p>
                  <p className='text-sm text-gray-200 mb-2'>Give your new server a personality with a name and an icon. You can always change it later.</p>
                  <div className='flex flex-col text-left'>
                    <label htmlFor="Server name" className="block text-ssm font-bold leading-6 text-gray-100">
                      SERVER NAME
                    </label>
                    <div className="my-2">
                      <input value={input.createServer} onChange={(e) => setInput({...input, createServer:e.target.value})} type="text" required
                      className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                    </div>
                  </div>
                </div>
                <div className='justify-between flex p-4 rounded-b-xl bg-black-200'>
                  <button onClick={()=> setPopup({...popup, section:1})} className='text-white text-ssm'>Back</button>
                  <button className='text-white text-ssm px-5 py-2 rounded-sm bg-blue-50 '>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
  return (
    <div className="w-[3%] h-screen bg-black-400 py-5">
      <div className='space-y-3'>
        <div className='flex relative group cursor-pointer' onClick={() => (params.selected.serverID!==null ? params.setSelected({...params.selected, serverID:null}) : null)}>
            <div className={`w-[0.200rem] ${params.selected.serverID===null ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
            <div className='flex mx-auto items-center justify-center'>
              <img src={process.env.REACT_APP_IMG} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${params.selected._id===null ? 'rounded-xl': 'rounded-3xl'} bg-black-200 transition-all duration-300`}/>
            </div>
        </div>

        {data.map((server,index) => (
          <div key={index} className='flex relative group cursor-pointer' onClick={() => (params.selected.serverID!==server._id ? params.setSelected({...params.selected, serverID:server._id}) : null)}>
            <div className={`w-[0.200rem] ${params.selected.serverID===server._id ? 'h-10 scale-100' :'h-5 my-2.5'} rounded-r-xl bg-white scale-0 group-hover:scale-100 absolute transition-all duration-300`}></div>
            <div className='flex mx-auto items-center justify-center'>
              <img src={server.image} alt='server' className={`w-10 h-10 group-hover:rounded-xl ${params.selected.serverID===server._id ? 'rounded-xl': 'rounded-3xl'} transition-all duration-300`}/>
            </div>
          </div>
        ))}

        <div className='flex relative group cursor-pointer' onClick={() => setPopup({...popup, createServer: true})}>
          <div className='flex mx-auto items-center justify-center w-10 h-10 hover:rounded-xl rounded-3xl text-white bg-black-200 transition-all duration-300'>
              <FontAwesomeIcon icon={faPlus}/>
          </div>
        </div>
      </div>
      {popup.createServer ? popupSection() : null}
        
    </div>
  )
}

export default ServerSelect