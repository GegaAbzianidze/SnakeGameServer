const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://snake-game-with-controller.vercel.app/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`user ${socket.id} joined room ${room}`);
    socket.to(room).emit("connectSecondDevice", { id: socket.id, room: room });
  });

  socket.on("Inputs", (data) => {
    socket.to(data.room).emit("move", data.input);
    console.log(
      `user ${socket.id} sent ${data.input} input to room ${data.room}`
    );
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:5173");
});
