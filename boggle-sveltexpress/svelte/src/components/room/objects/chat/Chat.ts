import type { Socket } from "socket.io-client";
import type { Player } from "../Player";
import { MessageBlock } from "./MessageBlock";
import { writable, Writable } from 'svelte/store';
import { ObservableValue } from "src/utils/ObservableValue";

export class Chat {
    client: Socket;
    players: ObservableValue<Player[]>;
    messageBlocks = new ObservableValue<MessageBlock[]>([]);

    constructor(client: Socket, players: ObservableValue<Player[]>) {
        this.client = client;
        this.players = players;
        this.init();
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
        this.messageBlocks.update((messageBlocks) => {
            // Get current messageblock
            let c_m_block: MessageBlock = messageBlocks[messageBlocks.length - 1];

            if (!c_m_block || c_m_block.player.uuid !== userId) {
                // Message from a new user, Create new Messageblock
                this.appendMessageBlock(userId);
                c_m_block = this.messageBlocks.get()[messageBlocks.length - 1];
            }

            // Add message to the newest messageblock
            c_m_block.addMessage(message);
        });
    }



    private appendMessageBlock(userId: string) {
        const player: Player = this.players.get().find((player) => player.uuid === userId);
        if (!player) return;

        this.messageBlocks.update((messageBlocks => {
            messageBlocks.push(new MessageBlock(player));
        }));
    }
}