import { useState, useEffect } from "react";

import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

import axios from "axios";

export default function Home(params) {
    const [selected, setSelected] = useState({
        serverID: null,
        channelID: null,
    });
    const [server, setServer] = useState([{}]);
    const user= params.user;
    const [data, setData] = useState([])
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER}/listServers`, { user: params.user })
          .then(res => {
            setData(res.data);
          }).catch(err => {
            console.log(err);
          });
      }, []);

      useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER}/getServer`, { serverID: selected.serverID}).then(res => {
            setServer(res.data);
        })
    }
    , [selected]);



    return(
        <div className="flex">
            <ServerSelect selected={selected} setSelected={setSelected} user={user} data={data} setData={setData}/>
            <Channels selected={selected} setSelected={setSelected} setData={setData} selectedServer={server} user={user} setLogin={params.setLogin}/>
            <ChatBox selected={selected} selectedServer={server} user={user}/>
            <Users selected={selected} selectedServer={server}/>
        </div>
    )
}