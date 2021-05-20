export class User {
    uuid!: string;
    name: string;
    avatar: string;
    victoryAudio: string;

    constructor(uuid: string, name: string, avatar: string, victoryAudio: string) {
        this.uuid = uuid;
        this.name = name;
        this.avatar = avatar;
        this.victoryAudio = victoryAudio;
    }
}