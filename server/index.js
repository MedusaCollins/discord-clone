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
    console.log(`User ${user.name} logged in`);
    io.emit("login", user);
  });
  socket.on("chat message", (msg) => {
    console.log(msg);
    console.log(`Message: ${msg.text}`);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});