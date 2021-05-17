import { Room } from "./room";
import { Board } from "./board";
import { RoomSettings } from "./room_settings";
import { Socket } from "socket.io";
import * as http from "http";

export class Game {
    started = false;
    room: Room;
    board!: Board;
    room_settings: RoomSettings;
    round_timer: number = 0;
    next_round_time: number = 6;
    next_round_timer: number = 0;
    current_round: number = 1;
    round_in_progress = false;

    constructor(room: Room, room_settings: RoomSettings) {
        this.room = room;
        this.room_settings = room_settings;
    }

    public async start() {
        // Set each player's scores to 0
        this.room.players.forEach((player) => {
            player.score = 0;
            this.room.emit("player_score_changed", player.id, player.score);
        });
        this.current_round = 1;
        this.started = true;
        this.room.emit("game_started");

        this.startRound();
    }

    public stop() {
        console.log("🎮 [game]: Game ended");
        this.started = false;
        const winner = this.room.players.reduce((prev, current) => {
            return (prev.score > current.score) ? prev : current;
        });
        this.room.emit("game_ended", winner ? winner.victory_audio : "");
    }

    public async on_submit(socket: Socket, positions: number[]) {
        if (!this.round_in_progress) return;
        const player = this.room.get_player_by_id(socket.id);
        if (!player) return;
        /** Validate input */
        if (positions.length < 1) {
            return this.emitWordStatus(socket, "", false, "Submitted word was empty");
        }
        let word_arr: string[] = [];
        for (let position of positions) {
            if (position < 0 || position > this.board.layout.length) {
                return this.emitWordStatus(socket, "", false, "Submitted position exceeded possible range of positions");
            }
            word_arr.push(this.board.layout[position]);
        }
        const word: string = word_arr.join("");
        if (word.length < 3) {
            return this.emitWordStatus(socket, "", false, `Submitted word (${word}) needs to be at least 3 characters long`);
        }
        if (player.found_words.includes(word)) {
            return this.emitWordStatus(socket, "", false, "Submitted word already found");
        }

        /** Determine whether word was possible with the current board */
        if (positions.length > this.board.layout.length) {
            return this.emitWordStatus(socket, word, false, `Submitted word exceeded maximum possible size. Size of board: ${this.board.layout.length}, Length of word ${positions.length}`);
        }
        const allowed_position_difs = [1, 3, 4, 5];
        for (let i = 0; i < positions.length; i++) {
            if (i == 0) {
                // First position is always valid
                continue;
            }
            const position_dif = Math.abs(positions[i] - positions[i - 1]);
            if (!allowed_position_difs.includes(position_dif)) {
                return this.emitWordStatus(socket, "", false, "Submitted order of positions were not allowed");
            }
        }

        /** Check if word exists */
        const options = {
            hostname: "127.0.0.1",
            port: 3000,
            path: `/wordchecker/${this.room_settings.language}/${word}`,
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        const request = http.request(options, (response) => {
            response.setEncoding("utf-8");
            response.on("data", (data) => {
                console.log(data);
                const exists: boolean = JSON.parse(data)["exists"];
                if (!exists) {
                    return this.emitWordStatus(socket, word, false, "Word doesn't exist in our dictionary");
                }
                player.score += this.determineScore(word_arr);
                player.found_words.push(word);
                return this.emitWordStatus(socket, word, true, "Submitted word was valid");
            });
        });
        request.on("error", (e: Error) => {
            this.emitWordStatus(socket, word, false, e.message);
        });
        request.end();
    }

    private emitWordStatus(socket: Socket, word: string, valid: boolean, reason?: string) {
        socket.emit("word_validated", word, valid, reason);
        const player = this.room.get_player_by_id(socket.id);
        if (!player) return;
        if (valid) {
            this.room.emit("player_score_changed", player.id, player.score);
        }
    }

    private determineScore(word_arr: string[]): number {
        return 12;
    }

    public async startRound() {
        this.room.players.forEach((player) => player.found_words = []);
        // Announce round ended
        this.nextRoundTimer(() => {
            // Second passed
            this.room.emit("next_round_timer_changed", this.current_round, (this.next_round_time - this.next_round_timer));
        }, () => {
            // Start next round
            this.round_in_progress = true;

            // Create new board
            this.board = new Board();
            console.log(`🎮 [game]: Starting round ${this.current_round}`);
            this.room.emit("round_started", this.current_round, this.board.layout);
            this.room.emit("round_timer_changed", this.room_settings.round_time);
            this.roundTimer(() => {
                // Second Passed
                this.room.emit("round_timer_changed", (this.room_settings.round_time - this.round_timer));
            }, () => {
                // Round ended
                this.round_in_progress = false;
                if (this.current_round++ >= this.room_settings.rounds) {
                    // Game ended
                    this.stop();
                    return;
                }
                this.room.emit("round_ended");
                this.startRound();
            });
        });
    }

    private async roundTimer(second_passed: Function, round_ended: Function) {
        while (this.round_timer < this.room_settings.round_time) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.round_timer += 1;
            second_passed();
        }
        this.round_timer = 0;
        round_ended();
    }

    private async nextRoundTimer(second_passed: Function, start_next_round: Function) {
        while (this.next_round_timer < this.next_round_time) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.next_round_timer += 1;
            second_passed();
        }
        this.next_round_timer = 0;
        start_next_round();
    }
}