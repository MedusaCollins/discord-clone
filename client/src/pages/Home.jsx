import { useState, useEffect } from "react";

import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

import axios from "axios";
import { io } from "socket.io-client";

export default function Home(params) {
    const [selected, setSelected] = useState({
        serverID: null,
        channelID: null,
    });
    const [popup, setPopup] = useState({
        serverInfo: false,
        serverSettings: false,
        invite: false,
        leave: false,
        createChannel: false,
      })

    const [server, setServer] = useState([{}]);
    const user= params.user;
    const [data, setData] = useState([])
    const [socket, setSocket] = useState(null);



    function checkUserRole(server, user){
        if (server.serverUsers !== undefined){
          var user = server.serverUsers.find(u => u.email === user.email)
          var role = server.serverRoles.find(role => role.name === user.roles[0])
          return role
        }
        else{
          return null
        }
    }
    const [access, setAccess] = useState(null)

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SERVER);
        setSocket(socket);
        socket.on("joinServer", (data) => {
            if(data.serverID === selected.serverID){
                axios.post(`${process.env.REACT_APP_SERVER}/getServer`, { serverID: selected.serverID}).then(res => {
                    setServer(res.data);
                })
            }
        })
        socket.on("leaveServer", (data) => {
            if(data.serverID === selected.serverID){
                axios.post(`${process.env.REACT_APP_SERVER}/getServer`, { serverID: selected.serverID}).then(res => {
                    setServer(res.data);
                })
            }
        })
        return () => {
            socket.disconnect();
        };
    }, [selected]);
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
            setPopup({...popup, serverInfo:false});
            if (selected.serverID !== undefined && selected.serverID !== null){
                setAccess(checkUserRole(res.data, user).access)
            }else{
                setAccess(null)
            }
        })
    }
    , [selected]);

    return(
        <div className="flex">
            <ServerSelect selected={selected} setSelected={setSelected} user={user} data={data} setData={setData}/>
            <Channels selected={selected} setSelected={setSelected} setData={setData} selectedServer={server} user={user} setLogin={params.setLogin} popup={popup} setPopup={setPopup} access={access}/>
            <ChatBox selected={selected} selectedServer={server} setServer={setServer} user={user} access={access}/>
            <Users selected={selected} selectedServer={server}/>
        </div>
    )
}