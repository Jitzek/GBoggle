import { Socket } from "socket.io";
import { Room } from "./room";

export enum Language {
    DUTCH
}

export class RoomSettings {
    room: Room;
    rounds: number = 1;
    round_time: number = 30;
    language: Language = Language.DUTCH;

    constructor(room: Room) {
        this.room = room;
    }

    public on_settings_changed(socket: Socket, setting: string, value: string) {
        if (this.room.host.id !== socket.id) {
            return;
        }
        switch (setting.toLowerCase()) {
            case "rounds":
                if (!isNaN(Number(value))) this.rounds = Number(value);
                break;
            case "round_time":
                if (!isNaN(Number(value))) this.round_time = Number(value);
                break;
            case "language":
                this.language = this.string_to_language(value);
                break;
        }
        this.room.emit("settings_changed", this.rounds, this.round_time, this.language);
    }

    private string_to_language(language_string: string) {
        switch(language_string.toUpperCase()) {
            case "DUTCH":
            default:
                return Language.DUTCH;
        }
    }
}