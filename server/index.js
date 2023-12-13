import Express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = Express();
app.use(cors({
  origin: process.env.CLIENT,
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.on("connection", (socket) => {
  try {
    socket.on("login", (user) => {
      io.emit("login", {type: "announcement", text: `joined.`, user: user, privite: true});
    });
  
    socket.on("chat message", (msg) => {
      msg.text = msg.text.length > 150 ? `${msg.text.slice(0, 150)}...` : msg.text;
      console.log(msg);
      io.emit("message", {type: "message", text: msg.text, user: msg.user});
    });
  
    socket.on("join lobby", (props) => {
      console.log(props.room);
  
      // Assuming props.user contains information about the new user
      const newUser = {
          name: props.user.user.name,
          email: props.user.user.email,
          imageUrl: props.user.user.imageUrl
      };
  
      // console.log(newUser)
      // Adding the new user to the players array
      props.room.players.push(newUser);
  
      // Logging the updated room object
      io.emit("join lobby", props.room);
    });
  
    socket.on("create lobby", (props) => {
      console.log(props)
      io.emit("create lobby", props);
    })
  
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
    
    socket.on("reconnect", () => {
      console.log("User reconnected");
    });
  } catch (error) {
    console.error("Login error:", error);
  }
});