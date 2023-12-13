import Chat from "./components/Chat";
import Lobby from "./components/Lobby";
import LobbyModule from "./components/LobbyModule";

import { useState } from 'react'

export default function Home(props) {
    const [rooms, setRooms] = useState([{
        name: 'room1',
        tags: ['power', 'classic'],
        players: [{name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}, {name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}],
        host: {name: 'Medusa Collins', email: 'collinsmedusa@gmail.com', imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c'}, 
        mode: 'classic tak-on', 
        status: 'waiting',
        password: '',
        maxPlayer: 10}])

    return(
        <div className="relative h-full">
            <div className="absolute top-0 w-full">
            <Lobby user={props} rooms={rooms} setRooms={setRooms}/>
            </div>
            <div className="absolute bottom-0 w-full">
            <LobbyModule user={props.user} setRooms={setRooms} rooms={rooms}/>
            <Chat props={props}/>
            </div>
        </div>
    );
}