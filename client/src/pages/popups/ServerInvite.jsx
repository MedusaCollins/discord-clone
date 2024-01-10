import React from 'react'

const ServerInvite = ({selectedServer, popup, setPopup}) => {
    const [text, setText] = React.useState('Copy')
    function invite(){
        navigator.clipboard.writeText(selectedServer._id)
        setText('Copied')
        setTimeout(() => setText('Copy'), 1000)
      }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPopup({...popup, serverInvite: false, showPopup: false})}>
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
                <button className={`text-white text-ssm px-5 py-2 rounded-sm transition-all ${text==="Copy" ?'bg-blue-50': 'bg-green-700'} ${text==="Copy" ?'hover:bg-[#454fc0]': 'hover:bg-green-800'}`} onClick={() => invite()}>{text}</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div> 
  )
}

export default ServerInvite