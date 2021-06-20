import type { PlayerObject } from "./PlayerObject";

export class PlayersObject {
    players: PlayerObject[];

    constructor() {
        this.players = [];
    }

    public getPlayerById(id: string): PlayerObject | undefined {
        return this.players.find(player => player.id === id);
    }

    public addPlayer(id: string, name: string, avatar: string, score: number, is_host: boolean) {
        this.players.push({
            id: id,
            name: name,
            avatar: avatar,
            score: score,
            is_host: is_host
        });
        this.updatePlayers(this.players);
    }

    public removePlayerByID(id: string) {
        this.updatePlayers(this.players.filter(player => player.id !== id));
    }

    public changeScoreOfPlayerByID(id: string, score: number) {
        const player = this.players.find(_player => _player.id === id);
        if (!player)
            return;
        player.score = score;
        this.updatePlayers(this.players);
    }

    public updatePlayers(new_players: PlayerObject[]) {
        // Order alphabetically
        new_players.sort((_p1: PlayerObject, _p2: PlayerObject) => _p1.name.localeCompare(_p2.name));

        // Order by score
        new_players.sort((_p1: PlayerObject, _p2: PlayerObject) => {
            if (_p1.score == _p2.score) return 0;
            return _p1.score < _p2.score ? 1 : -1;
        });

        this.players = new_players;
    }
}