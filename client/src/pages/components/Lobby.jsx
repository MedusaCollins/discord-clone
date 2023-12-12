import React, { useEffect } from 'react'


const Lobby = (props) => {
    const {rooms, setRooms} = props

    useEffect(() => {
        console.log(rooms)
    }
    , [rooms])

  return (
    <div className='p-12 space-y-12 text-white h-[600px] overflow-auto'>
        {rooms.map((room, index) => (
            <button key={index} onClick={()=> console.log("join")} className='grid grid-flow-col grid-cols-4 gap-5 p-4 hover:bg-slate-700 rounded-xl w-full'>
                <div className='grid col-span-1'>
                    <h1 className='text-2xl'>{room.mode}</h1>
                    <div className='flex gap-5'>
                        <p>Players: {room.players.length+1} / {room.maxPlayer}</p>
                        <h5>Status: {room.status}</h5>
                    </div>
                </div>
                <div className='grid col-span-3'>
                    <div className='flex gap-12'>
                        <img src={room.host.imageUrl} alt='Host' className='border border-red-500'/>
                        <div className='justify-between flex flex-col'>
                            <h2>{room.name}</h2>
                            <div className='flex'>
                                {room.tags.map((tag, index) => (
                                    <div key={index} className='rounded-full bg-yellow-300 text-black p-1 m-1 text-sm'>#{tag}</div>
                                    ))}
                            </div>
                            <div className='flex gap-5'>
                                <h2 className='flex gap-5'>{room.players.map((player, index) => (
                                    <img src={player.imageUrl} alt={player.name} key={index}  className='w-12 border border-red-500'/>
                                ))}
                                </h2>
                                {Array(room.maxPlayer - room.players.length - 1).fill().map((_, index) => (
                                    <div key={index} className='border border-green-500 w-12 h-12'></div>
                                ))}
                        </div>
                        </div>
                    </div>
                </div>
            </button>
        ))}
    </div>
  )
}

export default Lobby