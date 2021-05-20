export class Board {
    layout: string[] = [];
    dice = [
        // Row 1
        ['R', 'I', 'F', 'O', 'B', 'X'], ['I', 'F', 'E', 'H', 'E', 'Y'], ['D', 'E', 'N', 'O', 'W', 'S'], ['U', 'T', 'O', 'K', 'N', 'D'],
        // Row 2
        ['H', 'M', 'S', 'R', 'A', 'O'], ['L', 'U', 'P', 'E', 'T', 'S'], ['A', 'C', 'I', 'T', 'O', 'A'], ['Y', 'L', 'G', 'K', 'U', 'E'],
        // Row 3
        ['Q', 'B', 'M', 'J', 'O', 'A'], ['E', 'H', 'I', 'S', 'P', 'N'], ['V', 'E', 'T', 'I', 'G', 'N'], [ 'B', 'A', 'L', 'I', 'Y', 'T'],
        // Row 4
        ['E', 'Z', 'A', 'V', 'N', 'D'], ['R', 'A', 'L', 'E', 'S', 'C'], ['U', 'W', 'I', 'L', 'R', 'G'], ['P', 'A', 'C', 'E', 'M', 'D']
    ];

    constructor() {
        // Create random layout according to dice
        this.createRandomLayout();
    }

    private createRandomLayout() {
        this.layout = [];
        // Layout is 4x4 (so 16 positions)
        for (let i = 0; i < 16; i++) {
            this.layout.push(this.getRandomLetterOfDice(i));
        }
    }

    private getRandomLetterOfDice(index: number) {
        return this.dice[index][Math.floor(Math.random() * this.dice[index].length)];
    }
}