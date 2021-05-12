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

const test_room_1 = new Room(io, "host_1", "");
const test_room_2 = new Room(io, "host_2", "password");

test_room_1.uuid = "test_room_1";
test_room_2.uuid = "test_room_2";

rooms.push(test_room_1);
rooms.push(test_room_2);

io.on("connection", (socket: Socket) => {
  console.log(`📡 [socket]: Client connected`);

  socket.on("create_room", (host_name: string, host_avatar: string, host_victory_audio: string, password: string) => {
    const room = new Room(io, socket.id, password);
    rooms.push(room);
    console.log(`📡 [socket]: ${host_name} (ID: ${socket.id}) created a new room with uuid ${room.uuid}`);
    socket.emit("room_created", room.uuid, socket.id);
  });

  socket.on("room_information", (room_uuid: string) => {
    const room = rooms.find(room => room.uuid === room_uuid);
    let exists = false;
    let password_protected = false;
    let is_host = false;
    if (room) {
      exists = true;
      password_protected = room.is_password_protected();
      is_host = room.host_id === socket.id;
    }
    socket.emit("room_information", exists, password_protected, is_host);
  });

  socket.on("join_room", (room_uuid: string, name: string, avatar: string, victory_audio: string, password: string) => {
    console.log(`📡 [socket]: Client ${name} requests to join room ${room_uuid}`);
    const room = rooms.find(_room => {
      return _room.uuid == room_uuid;
    });
    if (!room) {
      console.log("❗📡 [socket]: No room with requested uuid found");
      return;
    }

    if (room.is_password_protected() && room.host_id != socket.id) {
      if (!room.check_password(password)) {
        // Invalid password
        console.log("❗📡 [socket]: Passwords didn't match");
        socket.emit("incorrect_password");
        return;
      }
    }

    room.join(socket, new Player(socket.id, name, avatar, victory_audio));
    console.log(`📡 [socket]: ${name} (ID: ${socket.id}) joined the room with uuid ${room.uuid}`);
    room.emit("joined_room", socket.id);
  });

  // socket.on("disconnect", (reason) => {
  //   console.log(`📡 [socket]: Client with ID "${socket.id}" disconnected with reason: ${reason}`);
  // });
});