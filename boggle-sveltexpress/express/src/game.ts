import { Room } from "./room";
import { RoomSettings } from "./room_settings";

export class Game {
    started = false;
    room: Room;
    room_settings: RoomSettings;
    round_timer: number = 0.0;

    constructor(room: Room, room_settings: RoomSettings) {
        this.room = room;
        this.room_settings = room_settings;
    }

    public start() {
        this.started = true;
    }

    public stop() {
        this.started = false;
    }
}