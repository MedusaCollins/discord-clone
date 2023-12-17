import { useState, useEffect } from "react";

import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

import axios from "axios";

export default function Home(params) {
    const [selected, setSelected] = useState({
        serverID: null,
        channelID: "01",
    });
    const [server, setServer] = useState([{}]);
    const user= params.user;

    const [data, setData] = useState([])
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER}/listServers`, { user: params.user })
          .then(res => {
            setData(res.data);
            console.log(res.data[0]._id)
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
            <ServerSelect selected={server} setSelected={setSelected} user={user} data={data} setData={setData}/>
            <Channels selected={selected} selectedServer={server} user={user}/>
            {/* <ChatBox selected={selected} user={user}/> */}
            {/* <Users selected={selected} user={user}/> */}
        </div>
    )
}