import type { Socket } from "socket.io-client";
import type { Player } from "../Player";
import { MessageBlock } from "./MessageBlock";
import { writable, Writable } from 'svelte/store';

export class Chat {
    client: Socket;
    players: Player[];
    messageBlocks: MessageBlock[] = [];

    messageCallback: Function;

    constructor(client: Socket, players: Player[]) {
        this.client = client;
        this.players = players;
        this.init();
    }

    public setOnMessageCallback(callback: () => void) {
        this.messageCallback = callback;
    }

    private init() {
        this.client.on("message_send", (userId: string, message: string) => this.on_message(userId, message));
    }

    public sendMessage(message: string) {
        this.client.emit("send_message", message);
    }

    private on_message(userId: string, message: string) {
        if (message.length < 1) {
            return;
        }
        // Get current messageblock
        let c_m_block: MessageBlock = this.messageBlocks[this.messageBlocks.length - 1];

        if (!c_m_block || c_m_block.player.uuid !== userId) {
            // Message from a new user, Create new Messageblock
            this.appendMessageBlock(userId);
            c_m_block = this.messageBlocks[this.messageBlocks.length - 1];
        }

        // Add message to the newest messageblock
        c_m_block.addMessage(message);
        
        this.messageCallback();
    }



    private appendMessageBlock(userId: string) {
        const player: Player = this.players.find((player) => player.uuid === userId);
        if (!player) return;

        this.messageBlocks.push(new MessageBlock(player));
    }
}