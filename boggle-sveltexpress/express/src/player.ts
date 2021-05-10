export class Player {
    id: string;
    name: string;
    avatar: string;
    victory_audio: string;
    score: number = 0;
    found_words: string[] = [];

    constructor(id: string, name: string, avatar: string, victory_audio: string) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.victory_audio = victory_audio;
    }
}