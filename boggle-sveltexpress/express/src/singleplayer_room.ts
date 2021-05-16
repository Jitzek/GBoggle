import { Server } from "socket.io";
import { Socket } from "socket.io";
import { Game } from "./game";
import { Player } from "./player";
import { Room } from "./room";

export class SingleplayerRoom extends Room {
    player!: Player;

    constructor(server: Server, host_id: string, password: string) {
        super(server, host_id, password);
        this.room_settings.round_time = 180;
    }

    public join(socket: Socket, player: Player) {
        // Only accept one player
        if (this.players.length > 0) {
            return;
        }
        this.player = player;
        super.join(socket, player);
        socket.on("submit_score", () => this.on_submit_score(socket));
    }

    protected on_start_game(socket: Socket) {
        if (socket.id !== this.player.id) return;
        this.game = new Game(this, this.room_settings);
        this.game.start();
    }

    protected on_language_changed(socket: Socket, new_language: string) {
        if (socket.id !== this.player.id) return;
        this.room_settings.change_language(socket, new_language);
    }

    private on_submit_score(socket: Socket) {
        if (socket.id !== this.player.id) return;
        // Submit score
    }
}