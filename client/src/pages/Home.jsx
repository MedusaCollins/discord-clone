import { useState, useEffect } from "react";

import ServerSelect from "./components/ServerSelect";
import Channels from "./components/Channels";
import ChatBox from "./components/ChatBox";
import Users from "./components/Users";

import axios from "axios";
import { io } from "socket.io-client";
import PopupManager from "./popups/PopupManager";

export default function Home(params) {
    const [selected, setSelected] = useState({
        serverID: null,
        channelID: null,
    });    
    const [popup, setPopup] = useState({
        showPopup: false,
        serverInfo: false,
        serverSettings: false,
        channelSettings: false,
        channelInfo:{},
        serverInvite: false,
        leave: false,
        createChannel: false,
        createServer: false,
        joinServer: false,
        section: 1
      })

    const [server, setServer] = useState([{}]);
    const user= params.user;

    const [input, setInput] = useState({
        serverName: server.name,
        searchMembers: "",
        searchUserId: "",
        channelType: "",
        channelName: "",
        roleName: "",
        roleColor: "",
        roleAccess: "",
        createServer: `${user.name}'s Server`,
        joinServer: '',
        errorHandler: ''
      });
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

    function serverUpdate(){
        axios.post(`${process.env.REACT_APP_SERVER}/getServer`, { serverID: selected.serverID}).then(res => {
            setServer(res.data);
        })
    }
    function serversUpdate(){
        setSelected({serverID: null, channelID: null})
        axios.post(`${process.env.REACT_APP_SERVER}/listServers`, { user: params.user })
          .then(res => {
            setData(res.data);
          }).catch(err => {
            console.log(err);
          });
    }
    useEffect(() => {
        const socket = io(process.env.REACT_APP_SERVER);
        setSocket(socket);
        // ServerUpdate diye bir event oluşturduk ve /getServer ile refresh atılması sağlanacak.
        socket.on("joinServer", (data) => {
            if(data.serverID === selected.serverID){
                serverUpdate()
            }
        })
        socket.on("leaveServer", (data) => {
            if(data.serverID === selected.serverID){
                serverUpdate()
            }
        })
        socket.on("deleteServer", (data) => {
            serversUpdate()
        })
        socket.on("updateServer", (data)=> {
            serverUpdate()
        })
        socket.on("channelUpdate", (data) => {
            if(data.server._id === selected.serverID){
                setServer(data.server);
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
            <PopupManager input={input} setInput={setInput} selected={selected} selectedServer={server} popup={popup} setPopup={setPopup} access={access} user={user} data={data} setData={setData}/>
            <ServerSelect selected={selected} setSelected={setSelected} user={user} data={data} setData={setData} popup={popup} setPopup={setPopup}/>
            <Channels input={input} setInput={setInput} selected={selected} setSelected={setSelected} data={data} setData={setData} selectedServer={server} user={user} setLogin={params.setLogin} popup={popup} setPopup={setPopup} access={access}/>
            <ChatBox selected={selected} selectedServer={server} setServer={setServer} user={user} access={access}/>
            <Users selected={selected} selectedServer={server}/>
        </div>
    )
}