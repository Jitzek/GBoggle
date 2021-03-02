import express from 'express';
import path from 'path';
import { Server as SocketIO } from 'socket.io';

const PORT = 8000;
const app = express();

// Return index.html of svelte
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../", "svelte", "public", "index.html"));
});

// app.listen() returns the HTTP server instance which we can reuse for our socket.
const server = app.listen(PORT, () => {
  console.log(`✅ [server]: Server is running at http://localhost:${PORT}`);
});

// Create socket (listening on the same address as server)
const io = new SocketIO(server);
io.on("connect", (socket: any) => {
  console.log(`📡 [socket]: Client connected`);
});