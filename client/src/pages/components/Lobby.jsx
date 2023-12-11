import React from 'react'
import { useState } from 'react'

const Lobby = () => {
    const [rooms, setRooms] = useState([{
            name: 'room1',
            tags: ['power', 'classic'],
            players: [{name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}, {name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}],
            host: {name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}, 
            mode: 'classic tak-on', 
            status: 'waiting', 
            maxPlayer: 10}])
    console.log(rooms)
  return (
    <div className='p-12 space-y-12 text-white'>
        {rooms.map((room) => (
            <button className='grid grid-flow-col grid-cols-4 gap-5 p-4 hover:bg-slate-700 rounded-xl w-full'>
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
                                {room.tags.map((tag) => (
                                    <div className='rounded-full bg-yellow-300 text-black p-1 m-1 text-sm'>#{tag}</div>
                                    ))}
                            </div>
                            <div className='flex gap-5'>
                                <h2 className='flex gap-5'>{room.players.map((player, index) => (
                                    <img src={player.imageUrl} alt={player.name}  className='w-12 border border-red-500'/>
                                ))}
                                </h2>
                                {Array(room.maxPlayer - room.players.length - 1).fill().map((_, index) => (
                                    <div className='border border-green-500 w-12 h-12'></div>
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