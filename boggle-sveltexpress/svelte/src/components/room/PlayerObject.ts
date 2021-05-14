export class PlayerObject {
    id: string;
    name: string;
    avatar: string;
    score: number;
    is_host: boolean;

    constructor(id: string, name: string, avatar: string, score: number, is_host: boolean) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.score = score;
        this.is_host = is_host;
    }
}