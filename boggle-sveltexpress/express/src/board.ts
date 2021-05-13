export class Board {
    layout: string[];

    constructor() {
        this.layout = [
            "K", "T", "C", "D",
            "E", "F", "G", "H",
            "I", "J", "K", "L",
            "M", "N", "O", "P"
        ];
    }
    
    /**
     * Checks whether a combination of letters (word) is possible for this board
     * @param word 
     */
    public word_is_valid(word: string) {
        const word_arr: string[] = [];
        for (let i = 0; i < word.length; i++) {
            if (word.charAt(i) == 'Q' && word.charAt(i+1) == 'u') {
                word_arr.push(`${word.charAt(i)}${word.charAt(i+1)}`);
                i++;
                continue;
            }
            word_arr.push(word.charAt(i));
        }
        console.log(word_arr);
    }
}