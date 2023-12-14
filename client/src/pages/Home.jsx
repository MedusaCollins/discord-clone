import { useState, useEffect } from "react";

import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

export default function Home(params) {
    const [selected, setSelected] = useState({
        server: null,
        channel: 0
    });
    const user= params.user;

    useEffect(() => {
        console.log(selected);
    }
    , [selected]);
    return(
        <div className="flex">
            <ServerSelect selected={selected} setSelected={setSelected} user={user}/>
            <Channels selected={selected} setSelected={setSelected} user={user}/>
            <ChatBox selected={selected} user={user}/>
            <Users selected={selected} user={user}/>
        </div>
    )
}