import React, {useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const ServerSelect = (params) => {
  const [data, setData] = [params.data, params.setData]
  const [popup, setPopup] = useState({
    createServer: false,
    joinServer: false,
  });
  const [input, setInput] = useState(`${params.user.name}'s Server`)
  async function createServer(event) {
    event.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/createServer`, { serverName: input, user: params.user });
      setData([...data, res.data]);
      setInput('');
      setPopup({...popup, createServer: false});
    } catch (err) {
      console.log(err);
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
      {popup.createServer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-60" onClick={() => setPopup({...popup, createServer: false})}>
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
                      <input value={input} onChange={(e) => setInput(e.target.value)} type="text" required
                      className="w-full px-2 py-2 text-sm rounded-sm bg-[#1E1F22] text-gray-300 border-0 ring-0 outline-none resize-none" />
                    </div>
                  </div>
                </div>
                <div className='justify-between flex p-4 rounded-b-xl bg-black-200'>
                  <button className='text-white text-ssm'>Back</button>
                  <button className='text-white text-ssm px-5 py-2 rounded-sm bg-blue '>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        ): null}
    </div>
  )
}

export default ServerSelect