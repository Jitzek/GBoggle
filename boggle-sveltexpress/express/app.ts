import express from 'express';
import path from 'path';
import { Socket, Server, Namespace } from 'socket.io';
import { Player } from './src/player';
import { Game } from './src/game';
import { v4 as uuidv4 } from 'uuid';

const games: Game[] = [];

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

  socket.on("create_server", (host_name: string, host_avatar: string, host_victory_audio: string) => {
    const namespace: Namespace = io.of(uuidv4());
    const host = new Player(socket.id, host_name, host_avatar, host_victory_audio);
    games.push(new Game(namespace, host));
    console.log(`📡 Created new server with host: "${host.name}" (ID: ${host.id})`);
  });
});