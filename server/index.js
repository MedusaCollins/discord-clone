import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import Serverdb from "./model/servers.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT,
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
});

const port = process.env.PORT || 3001;

mongoose.connect(`${process.env.DB}`)
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`Mongodb connection error: ${err}`);
  });


app.post("/joinServer", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.serverID)) {
    return res.send({ 'Error': 'Invalid server ID.' });
  }else{
    const user = {
      name: req.body.user.name,
      email: req.body.user.email,
      imageUrl: req.body.user.imageUrl,
      roles: ["Guest"]
    }
    try {
      const server = await Serverdb.findOne({ 'serverUsers.email': req.body.user.email, '_id': new mongoose.Types.ObjectId(req.body.serverID) });
      if(server){
        res.send({'Error': 'You are already in this server.'});
      }else{
        const isServer = await Serverdb.findById(req.body.serverID);
        if(isServer){
          const server = await Serverdb.findByIdAndUpdate(req.body.serverID, { $push: { serverUsers: user } }, { new: true });
          console.log("test")
          res.send(server)
        }else{
          res.send({'Error': 'This server does not exist.'});
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }
});

app.post("/leaveServer", async (req, res) => {
  try {
    const server = await Serverdb.findOne({ 'serverUsers.email': req.body.user.email, '_id': req.body.serverID });
    if(server){
      await Serverdb.findByIdAndUpdate(req.body.serverID, { $pull: { serverUsers: req.body.user } }, { new: true });
      const server = await Serverdb.find({ 'serverUsers.email': req.body.user.email});
      res.send(server);
    }else{
      res.send({'Error': 'You are not in this server.'});
    }
  } catch (error) {
    console.error("Login error:", error);
  }
});
app.post("/createServer", async (req, res) => {
  const serverData = {
    serverID: '01',
    name: req.body.serverName,
    image: req.body.user.imageUrl,
    owner: req.body.user.email,
    channels: [
      {
        channelID: '01',
        name: 'General 1',
        type: 'Text',
        access: { read: ['Owner', 'Admin', 'Moderator', 'Member', 'Guest'], write: ['Owner', 'Admin', 'Moderator', 'Member'] },
        messages: []
      }
    ],
    serverUsers: [
      {
        name: req.body.user.name,
        email: req.body.user.email,
        imageUrl: req.body.user.imageUrl,
        roles: ['Owner']
      }
    ],
    serverRoles: [
      {
        name: 'Owner',
        color: '#FF0000',
        access: {
          manageServer: true,
          manageChannels: true,
          manageRoles: true,
          manageUsers: true,
          manageMessages: true,
          manageVoice: true,
          manageEmojis: true,
        }
      },
      {
        name: 'Admin',
        color: '#FF0000',
        access: {
          manageServer: false,
          manageChannels: false,
          manageRoles: false,
          manageEmojis: false,
          manageUsers: true,
          manageMessages: true,
          manageVoice: true,
        }
      },
      {
        name: 'Moderator',
        color: '#FF0000',
        access: {
          manageServer: false,
          manageChannels: false,
          manageRoles: false,
          manageEmojis: false,
          manageUsers: false,
          manageMessages: true,
          manageVoice: true,
        }
      },
      {
        name: 'Member',
        color: '#FF0000',
        access: {
          manageServer: false,
          manageChannels: false,
          manageRoles: false,
          manageEmojis: false,
          manageUsers: false,
          manageMessages: false,
          manageVoice: true,
        }
      },
      {
        name: 'Guest',
        color: '#FF0000',
        access: {
          manageServer: false,
          manageChannels: false,
          manageRoles: false,
          manageEmojis: false,
          manageUsers: false,
          manageMessages: false,
          manageVoice: false,
        }
      },
    ]
  };

  // Create a new Server document
  const server = new Serverdb(serverData);
      
  // Save the document to the database
  server.save()
    .then((result) => {
      res.send(result)
      console.log('Server document saved successfully');
    })
    .catch((error) => {
      console.error('Error saving Server document:', error);
    });

  console.log(serverData);
});

app.post("/listServers", async (req, res) => {
  try {
    const server = await Serverdb.find({ 'serverUsers.email': req.body.user.email});
    res.send(server);
  } catch (error) {
    console.error("Login error:", error);
  }
});


app.post("/getServer", async (req, res) => {
  try {
    const server = await Serverdb.findById(req.body.serverID);
    res.send(server);
  } catch (error) {
    console.error("Login error:", error);
  }
});

io.on("connection", (socket) => {
  try {  
    socket.on("sendMessage", async (msg) => {
      try {
        console.log(msg)
        const server = await Serverdb.findOne({ "channels._id": msg.channelID });
        const channel = server.channels.find(channel => channel._id == msg.channelID);
        const message={
          messageType: msg.messageType,
          message: msg.message,
          user: msg.user,
        }

        channel.messages.push(message);
        await Serverdb.findByIdAndUpdate(server._id, { $set: { channels: server.channels } }, { new: true});
        io.emit("getMessage", {server: server});
      } catch (error) {
        console.error("Error finding server:", error);
      }
    });
    socket.on("removeMessage", async (msg) => {
      const server = await Serverdb.findOne({ "channels.messages._id": msg.message._id });
      const channel = server.channels.find(channel => channel._id == msg.channelID);
      channel.messages = channel.messages.filter(message => message._id != msg.message._id);
      await Serverdb.findByIdAndUpdate(server._id, { $set: { channels: server.channels } }, { new: true});
      io.emit("getMessage", {server: server});
    });
    socket.on("addRole", async (data) => {
      console.log(data)
      const server = await Serverdb.findById(data.serverID);
      data.users.map(selectedUser => {
        const serverUser = server.serverUsers.find(user => user.email == selectedUser);
        serverUser.roles = [data.role]
        console.log(serverUser)
      })
      await server.save();
      io.emit("roleUpdate", {server: server});
      
      // console.log(user)
    })
    socket.on("createChannel", async (data) => {
      data.server.channels.push(data.channel);
      await Serverdb.findByIdAndUpdate(data.server._id, { $set: {channels: data.server.channels} }, { new: true});
      io.emit("channelUpdate", {server: data.server});
    })
    socket.on("deleteChannel", async (data) => {
      data.server.channels = data.server.channels.filter(channel => channel._id != data.channel._id);
      await Serverdb.findByIdAndUpdate(data.server._id, { $set: {channels: data.server.channels} }, { new: true});
      io.emit("channelUpdate", {server: data.server});
    })
    socket.on("joinServer", async (data) => {
      io.emit("joinServer", {serverID: server.serverID});
    })
    socket.on("leaveServer", async (server) => {
      io.emit("leaveServer", {serverID: server.serverID});
    })
    socket.on("deleteServer", async (server) => {
      try {
        await Serverdb.findByIdAndDelete(server.serverID);
        io.emit("deleteServer", { serverID: server.serverID });
      } catch (error) {
        console.error("Error deleting server:", error);
      }
    });
    socket.on("updateServer", async (data) => {
      try {
        const server = await Serverdb.findByIdAndUpdate(data.serverID, { $set: {name: data.serverName} }, { new: true});
        const updatedRoles = server.serverRoles.map(role => {
          if (role._id == data.roleID) {
            server.serverUsers.map(user => {
              if (user.roles.includes(role.name)) {
                user.roles = user.roles.filter(roleName => roleName != role.name);
                user.roles.push(data.roleName);
              }
            });
            server.channels.map(channel => {
              channel.access.read = channel.access.read.filter(roleName => roleName != role.name);
              channel.access.write = channel.access.write.filter(roleName => roleName != role.name);
              channel.access.read.push(data.roleName);
              channel.access.write.push(data.roleName);
              channel.messages.map(message => {
                if (message.user.roles.includes(role.name)) {
                  message.user.roles = message.user.roles.filter(roleName => roleName != role.name);
                  message.user.roles.push(data.roleName);
                }
              });
            });
            return { ...role, name: data.roleName, access: data.roleAccess, color: data.roleColor };
          } else {
            return role;
          }
        });
        server.serverRoles = updatedRoles;
        await server.save();
        io.emit("updateServer", { server: server });
      } catch (error) {
        console.error("Error updating server:", error);
      }
    });
    socket.on("addLog", async(data)=>{
      // console.log(data)
      const server = await Serverdb.findById(data.serverID);
      var logMessage = {
        type: data.type,
        byWhom: data.user,
        toWho: data.messageOwner,
        channel: data.channelName,
      }
      server.logs.push(logMessage);
      await server.save();
      io.emit("updateServer", {server: server});
    })
  } catch (error) {
    console.error("Login error:", error);
  }
});