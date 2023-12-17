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

app.post("/createServer", async (req, res) => {
  const serverData = {
    serverID: '01',
    name: req.body.serverName,
    image: req.body.user.imageUrl,
    channels: [
      {
        channelID: '01',
        name: 'General 1',
        type: 'text',
        access: { read: ['Owner', 'Admin', 'Moderator', 'Member', 'Guest'], write: ['Owner', 'Admin', 'Moderator', 'Member'] },
        messages: [
          {
            message: 'Hello World',
            user: {
              name: req.body.user.name,
              email: req.body.user.email,
              imageUrl: req.body.user.imageUrl,
              roles: ['Owner']
            }
          }
        ]
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
  // console.log(req.body)
  try {
    const server = await Serverdb.findById(req.body.serverID);
    console.log(server + "server")
    res.send(server);
  } catch (error) {
    console.error("Login error:", error);
  }
});

io.on("connection", (socket) => {
  try {  
    socket.on("chat message", (msg) => {
      const sampleServerData = {
        serverID: '01',
        name: 'Meduware',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c',
        channels: [
          {
            channelID: '01',
            name: 'General 1',
            type: 'text',
            access: { read: ['Owner', 'Admin', 'Moderator', 'Member', 'Guest'], write: ['Owner', 'Admin', 'Moderator', 'Member'] },
            messages: [
              {
                message: 'Hello World',
                user: {
                  name: 'Medusa Collins',
                  email: 'collinsmedusa@gmail.com',
                  imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c',
                  roles: ['Owner']
                }
              }
            ]
          },
          {
            channelID: '02',
            name: 'General 2',
            type: 'text',
            access: { read: ['Owner', 'Admin', 'Moderator', 'Member', 'Guest'], write: ['Owner', 'Admin', 'Moderator', 'Member'] },
            messages: [
              {
                message: 'Hello Worldss',
                user: {
                  name: 'Medusa Collins',
                  email: 'collinsmedusa@gmail.com',
                  imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c',
                  roles: ['Owner']
                }
              }
            ]
          }
        ],
        serverUsers: [
          {
            name: 'Medusa Collins',
            email: 'collinsmedusa@gmail.com',
            imageUrl: 'https://lh3.googleusercontent.com/a/ACg8ocJUsNIwm70oAlbkR3-J-XJ4RoN2ySL-YK_hCqp2C4Wzmg=s96-c',
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
      const serverdb = new Serverdb(sampleServerData);
      
      // Save the document to the database
      serverdb.save()
        .then((result) => {
          console.log('Server document saved successfully:', result);
        })
        .catch((error) => {
          console.error('Error saving Server document:', error);
        });

      // console.log(msg);
      // io.emit("message", {message: msg.text, user: msg.user});
    });
  
  } catch (error) {
    console.error("Login error:", error);
  }
});