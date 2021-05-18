export class Player {
    id: string;
    name: string;
    avatar: string;
    victory_audio: string;
    score: number = 0;
    found_words: string[] = [];
    duplicate_words: string[] = [];

    constructor(id: string, name: string, avatar: string, victory_audio: string) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.victory_audio = victory_audio;
    }

    public addFoundWord(word: string) {
        if (this.found_words.includes(word)) return;
        this.found_words.push(word);
    }

    public addDuplicateWord(word: string) {
        if (this.duplicate_words.includes(word)) return;
        this.duplicate_words.push(word);
    }

    public resetFoundWords() {
        this.found_words = [];
    }

    public resetDuplicateWords() {
        this.duplicate_words = [];
    }
}