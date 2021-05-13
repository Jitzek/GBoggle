import { Room } from "./room";
import { Board } from "./board";
import { RoomSettings } from "./room_settings";
import { Socket } from "socket.io";

export class Game {
    started = false;
    room: Room;
    board!: Board;
    room_settings: RoomSettings;
    round_timer: number = 0;
    next_round_time: number = 10;
    next_round_timer: number = 0;
    current_round: number = 1;

    constructor(room: Room, room_settings: RoomSettings) {
        this.room = room;
        this.room_settings = room_settings;
        this.room_settings.round_time = 10;
    }

    public setHandlers(socket: Socket) {
        socket.on("submit_word", (positions: number[]) => this.on_submit(socket, positions));
    }

    public async start() {
        this.started = true;
        this.room.emit("game_started");

        this.startRound();
    }

    public stop() {
        console.log("🎮 [game]: Game ended");
        this.started = false;
        // TODO: send victory audio
        this.room.emit("game_ended");
    }

    public on_submit(socket: Socket, positions: number[]) {
        // Validate input
    }

    public async startRound() {
        // Create new board
        this.board = new Board();
        console.log(`🎮 [game]: Starting round ${this.current_round}`);
        this.room.emit("round_started", this.current_round, this.board.layout);
        this.room.emit("round_timer_changed", this.room_settings.round_time);
        this.roundTimer(() => {
            // Second Passed
            this.room.emit("round_timer_changed", (this.room_settings.round_time - this.round_timer));
        }, () => {
            if (this.current_round++ >= this.room_settings.rounds) {
                // Game ended
                this.stop();
                return;
            }
            // Announce round ended
            this.room.emit("round_ended");
            this.nextRoundTimer(() => {
                // Second passed
                this.room.emit("next_round_timer_changed", (this.next_round_time - this.next_round_timer));
            }, () => {
                // Start next round
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