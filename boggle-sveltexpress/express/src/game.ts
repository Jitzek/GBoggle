import { Namespace } from 'socket.io';
import { Player } from './player';

export class Game {
    namespace: Namespace;
    host: Player;
    players: Player[];

    constructor(namespace: Namespace, host: Player) {
        this.namespace = namespace;
        this.host = host;
        this.players = [host];
    }
}