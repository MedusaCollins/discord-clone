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
  socket.on("login", (user) => {
    io.emit("login", {type: "announcement", text: `joined.`, user: user, privite: true});
  });
  socket.on("chat message", (msg) => {
    msg.text = msg.text.length > 150 ? `${msg.text.slice(0, 150)}...` : msg.text
    console.log(msg);
    io.emit("message", {type: "message", text: msg.text, user: msg.user});
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});