import { Server } from "socket.io";
import { Socket } from "socket.io";
import { Game } from "./game";
import { Player } from "./player";
import { Room } from "./room";
import * as http from "http";
import { readFileSync } from "fs";
import * as path from "path";
import * as querystring from "querystring";

export class SingleplayerRoom extends Room {
    player!: Player;
    score_submmited = false;
    api_key: string;

    constructor(server: Server, host_id: string, password: string) {
        super(server, host_id, password);
        this.room_settings.round_time = 180;
        try {
            this.api_key = readFileSync(path.resolve(__dirname, "../.api_key"), "utf-8");
        }
        catch (e) {
            this.api_key = "undefined";
            console.log(`Failed to open file containing API Key: ${e}`);
        }
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
        if (this.score_submmited) return;

        /** Submit score */
        const data = querystring.stringify({
            id: this.player.id,
            name: this.player.name,
            score: this.player.score,
            avatar: this.player.avatar,
            layout: JSON.stringify(this.game.board.layout)
        });
        const options = {
            hostname: "127.0.0.1",
            port: 3000,
            path: `/highscores`,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": this.api_key, "Content-Length": Buffer.byteLength(data) },
        };
        const request = http.request(options, (response) => {
            response.setEncoding("utf-8");
            response.on("data", (data) => {
                const success: boolean = JSON.parse(data)["success"];
                if (!success) {
                    const reason: string = JSON.parse(data)["reason"];
                    console.log(`🏚️  [room]: Failed to submit highscore of ${this.player.name} (ID: ${this.player.id}) with reason: ${reason}`);
                    return socket.emit("score_submitted", false);
                }
                console.log(`🏚️  [room]: Succesfully submitted highscore of ${this.player.name} (ID: ${this.player.id})`);
                this.score_submmited = true;
                return socket.emit("score_submitted", true);
            });
        });
        request.write(data);
        request.on("error", (e: Error) => {
            console.log(`🏚️  [room]: Failed to submit highscore of ${this.player.name} (ID: ${this.player.id}) with error: ${e.message}`);
            return socket.emit("score_submitted", false);
        });
        request.end();
    }
}