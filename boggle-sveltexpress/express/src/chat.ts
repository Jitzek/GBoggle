import { Socket } from "socket.io";
import { Room } from "./room";

export class Chat {
    room: Room;
    messages: Message[];

    constructor(room: Room) {
        this.room = room;
        this.messages = [];
    }

    public setHandlers(socket: Socket) {
        socket.on("send_message", (message: string) => this.addMessage(socket, message));
    }

    public addMessage(socket: Socket, message: string) {
        // No need to safe messages for now
        // this.messages.push(new Message(socket.id, message));
        this.room.emit("message_send", socket.id, message);
    }
}

class Message {
    messenger_uuid: string;
    message: string;

    constructor(messenger_uuid: string, message: string) {
        this.messenger_uuid = messenger_uuid;
        this.message = message;
    }
}