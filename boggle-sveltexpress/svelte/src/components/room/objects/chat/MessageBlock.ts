import type { Player } from "../Player";

export class MessageBlock {
    player: Player;
    messages: string[] = [];

    constructor(player: Player) {
        this.player = player;
    }

    public addMessage(message: string) {
        this.messages.push(message);
    }
}