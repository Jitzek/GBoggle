import express from 'express';
import path from 'path';
import { Socket, Server, Namespace } from 'socket.io';
import { Player } from './src/player';
import { Room } from './src/room';

const rooms: Room[] = [];

const PORT = 8000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Return index.html of svelte
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../", "svelte", "public", "index.html"));
});

// app.listen() returns the HTTP server instance which we can reuse for our socket.
const server = app.listen(PORT, () => {
  console.log(`✅ [server]: Server is running at http://localhost:${PORT}`);
});

// Create socket (listening on the same address as server)
const io = new Server(server);
io.on("connection", (socket: Socket) => {
  console.log(`📡 [socket]: Client connected`);

  socket.on("create_room", (host_name: string, host_avatar: string, host_victory_audio: string) => {
    const host = new Player(socket.id, host_name, host_avatar, host_victory_audio);
    const room = new Room(io, host);
    rooms.push(room);
    console.log(`📡 [socket]: ${host.name} (ID: ${host.id}) created a new room with uuid ${room.uuid}`);
  });

  socket.on("join_room", (room_id: string, name: string, avatar: string, victory_audio: string) => {
    const room = rooms.find(_room => {
      return _room.uuid == room_id;
    });
    if (!room) {
      // No room with requested ID found
      // TODO: inform user
      console.log("❗📡 [socket]: No room with requested uuid found");
      return;
    }
    room.join(socket, new Player(socket.id, name, avatar, victory_audio));
    console.log(`📡 [socket]: ${name} (ID: ${socket.id}) joined the room with uuid ${room.uuid}`);
    room.emit("message", "Hello from server!");
  });

  socket.on("disconnect", (reason) => {
    console.log(`📡 [socket]: Client with ID "${socket.id}" disconnected with reason: ${reason}`);
  });
});