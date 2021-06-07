export class Player {
    uuid: string;
    name: string;
    avatar: string;
    score: number;

    constructor(uuid: string, name: string, avatar: string, score: number) {
        this.uuid = uuid;
        this.name = name;
        this.avatar = avatar;
        this.score = score;
    }
}