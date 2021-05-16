import express from 'express';
import path from 'path';
import { Socket, Server, Namespace } from 'socket.io';
import { Player } from './src/player';
import { SingleplayerRoom } from './src/singleplayer_room';
import { MultiplayerRoom } from './src/multiplayer_room';


let multiplayer_rooms: MultiplayerRoom[] = [];
let singleplayer_rooms: SingleplayerRoom[] = [];

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

// const test_room_1 = new Room(io, "host_1", "");
// const test_room_2 = new Room(io, "host_2", "password");

// test_room_1.uuid = "test_room_1";
// test_room_2.uuid = "test_room_2";

// rooms.push(test_room_1);
// rooms.push(test_room_2);

io.on("connection", (socket: Socket) => {
  console.log(`📡 [socket]: Client connected`);

  socket.on("create_multiplayer_room", (password: string) => {
    const room = new MultiplayerRoom(io, socket.id, password);
    multiplayer_rooms.push(room);
    console.log(`📡 [socket]: ${socket.id} created a new multiplayer room with uuid ${room.uuid}`);
    socket.emit("room_created", room.uuid);
  });

  socket.on("create_singleplayer_room", () => {
    const room = new SingleplayerRoom(io, "", "");
    singleplayer_rooms.push(room);
    console.log(`📡 [socket]: ${socket.id} created a new singleplayer room with uuid ${room.uuid}`);
    socket.emit("room_created", room.uuid);
  });

  socket.on("room_information", (room_uuid: string) => {
    let room = getRoomByUUID(room_uuid);
    let exists = false;
    let password_protected = false;
    let is_host = false;
    let is_singleplayer = false;
    if (room) {
      exists = true;
      password_protected = room.is_password_protected();
      is_host = room.host_id === socket.id;
      is_singleplayer = (room instanceof SingleplayerRoom);
    }
    socket.emit("room_information", exists, password_protected, is_host, is_singleplayer);
  });

  socket.on("join_room", (room_uuid: string, name: string, avatar: string, victory_audio: string, password: string) => {
    console.log(`📡 [socket]: Client ${name} requests to join room ${room_uuid}`);
    const room = getRoomByUUID(room_uuid);
    if (!room) {
      console.log("❗📡 [socket]: No room with requested uuid found");
      return;
    }

    if (room.players.length >= room.max_players) {
      console.log(`❗📡 [socket]: Room is full ${room.players.length}/${room.max_players}`);
      socket.emit("room_full");
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

    if (name.trim().length < 3 || name.length > 20) {
      console.log("❗📡 [socket]: Name wasn't valid");
      socket.emit("invalid_name", "Length of name exceeded allowed range of 3-20 characters");
      return;
    }

    room.join(socket, new Player(socket.id, name, avatar, victory_audio));
    console.log(`📡 [socket]: ${name} (ID: ${socket.id}) joined the room with uuid ${room.uuid}`);
    room.emit("joined_room", socket.id);
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`📡 [socket]: Client with ID "${socket.id}" disconnected with reason: ${reason}`);

    // Called before room removes player

    let room = multiplayer_rooms.find(_room => _room.players.some(e => e.id === socket.id));
    // Remove room if it contains no more players (after the player leaves)
    if (room && room.players.length <= 1) {
      multiplayer_rooms = multiplayer_rooms.filter(_room => room && _room.uuid !== room.uuid);
      console.log(`📡 [socket]: Removed room ${room.uuid} because it contained no more players`);
    }
    else {
      room = singleplayer_rooms.find(_room => _room.players.some(e => e.id === socket.id));
      if (room && room.players.length <= 1) {
        singleplayer_rooms = singleplayer_rooms.filter(_room => room && _room.uuid !== room.uuid);
        console.log(`📡 [socket]: Removed room ${room.uuid} because it contained no more players`);
      }
    }

    // Check if host left
    // TODO: what to do when host leaves? random assignment?
  });
  
  socket.on("get_rooms", () => {
    // isLocked, name, lang, totalPlayers, maxPlayers
    socket.emit("get_rooms", multiplayer_rooms.map(room => ({
      id: room.uuid,
      isLocked: room.is_password_protected(), 
      name: room.get_player_by_id(room.host_id)?.name,
      lang: room.room_settings.language,
      totalPlayers: room.players.length,
      maxPlayers: room.max_players
    })));
  });

  function getRoomByUUID(uuid: string) {
    const all_rooms = multiplayer_rooms.concat(singleplayer_rooms);
    return all_rooms.find((room) => room.uuid === uuid);
  }
});