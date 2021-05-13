import { Socket } from "socket.io";
import { Room } from "./room";

export class RoomSettings {
    room: Room;
    rounds: number = 1;
    round_time: number = 30;
    language: string = "Dutch";

    constructor(room: Room) {
        this.room = room;
    }

    public setHandlers(socket: Socket) {
        socket.on("rounds_setting_changed", (new_rounds: number) => this.on_rounds_changed(socket, new_rounds));
        socket.on("round_time_setting_changed", (new_round_time: number) => this.on_round_time_changed(socket, new_round_time));
        socket.on("language_setting_changed", (new_language: string) => this.on_language_changed(socket, new_language));
    }

    private on_rounds_changed(socket: Socket, new_rounds: number) {
        if (socket.id !== this.room.host_id) return;
        this.rounds = new_rounds;
        this.room.emit("settings_changed", this.rounds, this.round_time, this.language);
    }

    private on_round_time_changed(socket: Socket, new_round_time: number) {
        if (socket.id !== this.room.host_id) return;
        this.round_time = new_round_time;
        this.room.emit("settings_changed", this.rounds, this.round_time, this.language);
    }

    private on_language_changed(socket: Socket, new_language: string) {
        if (socket.id !== this.room.host_id) return;
        this.language = new_language;
        this.room.emit("settings_changed", this.rounds, this.round_time, this.language);
    }
}