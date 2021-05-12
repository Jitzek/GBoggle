import { Server, Socket } from 'socket.io';
import { Player } from './player';
import { v4 as uuidv4 } from 'uuid';
import { Language, RoomSettings } from './room_settings';

export class Room {
    uuid: string;
    server: Server;
    host_id: string;
    players: Player[];
    password: string = "";
    room_settings: RoomSettings;

    constructor(server: Server, host_id: string, password: string) {
        this.server = server;
        this.uuid = uuidv4();

        // TEMPORARY ASSIGNMENT
        // this.uuid = 'test';

        this.host_id = host_id;
        this.players = [];
        this.password = password;

        this.room_settings = new RoomSettings(this);
    }

    public check_password(password: string) {
        if (this.password === password) {
            return true;
        }
        return false;
    }

    public is_password_protected() {
        return this.password.length > 0;
    }

    private on_message(socket: Socket, message: string) {
        const player = this.players.find(_player => _player.id == socket.id);
        if (!player) {
            // Message didnt come from a player currently in this room
            return;
        }
        console.log(`🏚️  [room]: Received message from ${player.name} (ID: ${player.id}): ${message}`);
    }

    private on_kick(player_id: string) {
        const player = this.get_player_by_id(player_id);
        if (!player) {
            return;
        }
        this.remove_player(player);
        this.emit("kick", player.id);
    }

    private remove_player(player: Player) {
        this.players = this.players.filter(_player => _player !== player);
    }

    public get_player_by_id(id: string) {
        return this.players.find(player => player.id === id);
    }

    public join(socket: Socket, player: Player) {
        this.players.push(player);
        socket.join(this.uuid);

        // Set handlers
        socket.on("message", (message: string) => this.on_message(socket, message));
        socket.on("kick_player", (player_id: string) => this.on_kick(player_id));
        socket.on("settings_changed", (setting: string, value: string) => this.room_settings.on_settings_changed(socket, setting, value));
        socket.on("disconnect", (reason: string) => this.on_disconnect(socket, reason));

        this.emit("player_joined", player.id, player.name, player.avatar, player.score, player.id === this.host_id);

        // Send all players to newly joined player
        for (player of this.players) {
            if (player.id == socket.id) continue;
            socket.emit("player_joined", player.id, player.name, player.avatar, player.score, player.id === this.host_id);
        }

        console.log(`🏚️  [room]: ${player.name} (ID: ${player.id}) joined`);
    }

    public on_disconnect(socket: Socket, reason: string) {
        console.log(`🏚️  [room]: User ${socket.id} disconnected, reason: ${reason}`);
        const player = this.get_player_by_id(socket.id);
        if (!player) {
            return;
        }
        this.remove_player(player);
        this.emit("player_removed", player.id);
    }

    public emit(event: string, ...args: any[]): boolean {
        return this.server.to(this.uuid).emit(event, ...args);
    }
}