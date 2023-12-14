import React from 'react'
import data from './Data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const ChatBox = (params) => {
  const { selected } = params

  return (
      <div className="w-[80%] h-screen flex flex-col justify-between bg-black-100">
        {selected.server !== null && selected.channel !== null ? (
          <div>
              {data[params.selected.server].channels[params.selected.channel].messages.map((msg,index) => (
                <div key={index} className='flex space-x-5 m-5 p-2 rounded-lg items-center hover:bg-black-200'>
                  <img src={msg.user.imageUrl} alt="" className='w-8 h-8 rounded-full'/>
                  <div>
                    <p>{msg.user.name}</p>
                    <p className='text-slate-100 text-sm'>{msg.message}</p>
                  </div>
                </div>
              ))}
          </div>
        ): null}

        {selected.server !== null && selected.channel !== null ? (
          <div className='py-1 px-2 my-4 mx-3 bg-black-50 flex items-center justify-center'>
            <button className='bg-gray text-black-50 w-4 h-4 text-sm mx-2 flex items-center justify-center rounded-full'><FontAwesomeIcon icon={faPlus}/></button>
            <input type="text" className=' bg-black-50 border-0 text-sm focus:ring-0 p-1 focus:outline-none overflow-auto w-full text-white truncate' placeholder={`${data[selected.server].channels[selected.channel].name} kanalına mesaj gönder`}/>
          </div>
        ): null}
      </div>
  );
}

export default ChatBox