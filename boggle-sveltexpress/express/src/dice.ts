export class Dice {
    value: string;
    position: number;
    selected: boolean;
    boardDimensions: number[]; // 2x2, 3x3, 4x4, 4x5, etc.

    constructor(value: string, position: number, selected: boolean, boardDimensions: number[]) {
        this.value = value;
        this.position = position;
        this.selected = selected;
        this.boardDimensions = boardDimensions;
    }

    public boundsWith(dice: Dice) {
        if (dice.position === this.position) return false;
        
        // Vertically at the first row of the board (ignore for now since dice shouldn't be allowed outside the board's positional range anyways)
        const isFirstRow = (this.position + 1) <= this.boardDimensions[0];
        // Vertically at the last row of the board (ignore for now since dice shouldn't be allowed outside the board's positional range anyways)
        const isLastRow = (this.position + 1) > ((this.boardDimensions[0] * this.boardDimensions[1]) - this.boardDimensions[0]);
        
        // Horizontally at the first column of the row
        const isFirstColumn = (this.position + 1) === 1 || (this.position + (Math.floor((this.position + 1) / this.boardDimensions[0]))) % (this.boardDimensions[0] + 1) === 0;
        // Horizontally at the last column of the row
        const isLastColumn = (this.position + 1) % this.boardDimensions[0] === 0;

        if ((isFirstColumn && this.position > dice.position) || (isLastColumn && this.position < dice.position)) {
            return ([this.boardDimensions[0] - 1, this.boardDimensions[0]].includes(Math.abs(this.position - dice.position)));
        }
        else if ((isFirstColumn && this.position < dice.position) || (isLastColumn && this.position > dice.position)) {
            return ([1, this.boardDimensions[0], this.boardDimensions[0] + 1].includes(Math.abs(this.position - dice.position)));
        }
        else {
            return ([1, this.boardDimensions[0] - 1, this.boardDimensions[0], this.boardDimensions[0] + 1].includes(Math.abs(this.position - dice.position)));
        }
    }

    public toggle() {
        this.selected = !this.selected;
    }
}