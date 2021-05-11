import { Server, Socket } from 'socket.io';
import { Player } from './player';
import { v4 as uuidv4 } from 'uuid';

export class Room {
    uuid: string;
    server: Server;
    host: Player;
    players: Player[];

    constructor(server: Server, host: Player) {
        this.server = server;
        this.uuid = uuidv4();
        
        // TEMPORARY ASSIGNMENT
        this.uuid = 'test';

        this.host = host;
        this.players = [host];
    }

    private on_message(socket: Socket, message: string) {
        const player = this.players.find(_player => _player.id == socket.id);
        if (!player) {
            // Message didnt come from a player currently in this room
            return;
        }
        console.log(`🏚️  [room]: Received message from ${player.name} (ID: ${player.id}): ${message}`);
    }

    public join(socket: Socket, player: Player) {
        this.players.push(player);
        socket.join(this.uuid);

        // Set handlers
        socket.on("message", (message: string) => this.on_message(socket, message));
    }

    public emit(event: string, message: string) {
        this.server.to(this.uuid).emit(event, message);
    }
}