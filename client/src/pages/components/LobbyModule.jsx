import React from 'react'

const LobbyModule = () => {
  return (
    <div className='text-white flex gap-5 items-center mx-auto place-content-center'>
        <button onClick={console.log("Yeni oyun")} className='p-2 bg-blue-500 hover:bg-blue-600 rounded-lg'>New Game</button>
        <button className='p-2 bg-green-500 hover:bg-green-600 rounded-lg'>Quick Join</button>
    </div>
  )
}

export default LobbyModule