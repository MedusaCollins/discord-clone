import Express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = Express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
  console.log(`Message: ${msg}`);
  io.emit("message", msg);
  });

  socket.on("disconnect", () => {
  console.log("A user disconnected");
  });
});