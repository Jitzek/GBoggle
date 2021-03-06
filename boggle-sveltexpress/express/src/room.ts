import { Server, Socket } from 'socket.io';
import { Player } from './player';
import { Game } from "./game";
import { v4 as uuidv4 } from 'uuid';
import { RoomSettings } from './room_settings';
import { Chat } from './chat';

export class Room {
    uuid: string;
    server: Server;
    game!: Game;
    host_id: string;
    players: Player[];
    password: string = "";
    room_settings: RoomSettings;
    chat: Chat;
    max_players: number;

    constructor(server: Server, host_id: string, password: string) {
        this.server = server;
        this.uuid = uuidv4();

        this.host_id = host_id;
        this.players = [];
        this.password = password;

        this.room_settings = new RoomSettings(this);

        this.game = new Game(this, this.room_settings);

        this.chat = new Chat(this);

        this.max_players = 16;
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
        socket.on("disconnect", (reason: string) => this.on_disconnect(socket, reason));
        socket.on("start_game", () => this.on_start_game(socket));
        socket.on("submit_word", (positions: number[]) => this.game.on_submit(socket, positions));
        socket.on("request_settings", () => this.on_request_settings(socket));
        socket.on("rounds_setting_changed", (new_rounds: number) => this.on_rounds_changed(socket, new_rounds));
        socket.on("round_time_setting_changed", (new_round_time: number) => this.on_round_time_changed(socket, new_round_time));
        socket.on("language_setting_changed", (new_language: string) => this.on_language_changed(socket, new_language));
        socket.on("unique_words_only_setting_changed", (new_unique_words_only: boolean) => this.on_unique_words_only_changed(socket, new_unique_words_only));
        socket.on("send_message", (message: string) => this.on_chat_message(socket, message));
        
        socket.emit("joined", socket.id);
        this.emit("player_joined", player.id, player.name, player.avatar, player.score, player.id === this.host_id);

        // Send all players to newly joined player
        for (player of this.players) {
            if (player.id == socket.id) continue;
            socket.emit("player_joined", player.id, player.name, player.avatar, player.score, player.id === this.host_id);
        }

        // Send up to date settings to the newly joined player
        this.on_request_settings(socket);
        if (this.game && this.game.started) {
            socket.emit("game_started", this.room_settings.rounds);
            if (this.game.round_in_progress) {
                socket.emit("round_started", this.game.board.layout, this.game.current_round);
            }
            else {
                socket.emit("round_ended", this.game.current_round + 1);
            }
        }

        console.log(`🏚️  [room]: ${player.name} (ID: ${player.id}) joined`);
    }

    protected on_request_settings(socket: Socket) {
        socket.emit("settings_changed", this.room_settings.rounds, this.room_settings.round_time, this.room_settings.language, this.room_settings.unique_words_only);
    }

    protected on_rounds_changed(socket: Socket, new_rounds: number) {
        if (socket.id !== this.host_id) return;
        this.room_settings.change_rounds(socket, new_rounds);
    }

    protected on_round_time_changed(socket: Socket, new_round_time: number) {
        if (socket.id !== this.host_id) return;
        this.room_settings.change_round_time(socket, new_round_time);
    }

    protected on_language_changed(socket: Socket, new_language: string) {
        if (socket.id !== this.host_id) return;
        this.room_settings.change_language(socket, new_language);
    }

    protected on_unique_words_only_changed(socket: Socket, new_unique_words_only: boolean) {
        if (socket.id !== this.host_id) return;
        this.room_settings.change_unique_words_only(socket, new_unique_words_only);
    }

    protected on_chat_message(socket: Socket, message: string) {
        this.chat.send_message(socket, message);
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

    protected on_start_game(socket: Socket) {
        if (socket.id !== this.host_id) return;
        this.game = new Game(this, this.room_settings);
        this.game.start();
    }

    public emit(event: string, ...args: any[]): boolean {
        return this.server.to(this.uuid).emit(event, ...args);
    }
}