import { Dice } from "./Dice";

export class BoardFactory {
    constructor() {}

    static getBoard(layout: string[]): Board {
        const _layout: Dice[] = [];
        layout.forEach((letter, i) => {
            _layout.push(new Dice(letter, i, false));
        });
        return new Board(_layout);
    }
}

export class Board {
    layout: Dice[];
    selectedDice: Dice[] = [];
    allowedPositionDiffs = [0, 1, 3, 4, 5];

    boardLayoutChangedCallback: (newLayout: Dice[]) => void;
    diceSelectedCallback: () => void;

    constructor(layout: Dice[]) {
        this.setLayout(layout);
    }
 
    public setDiceSelectedCallback(callback: () => void) {
        this.diceSelectedCallback = callback;
    }

    public setBoardLayoutChangedCallback(callback: (newLayout: Dice[]) => void) {
        this.boardLayoutChangedCallback = callback;
    }

    public deselectAllDice() {
        this.selectedDice = [];
        this.layout.forEach((dice: Dice) => dice.selected = false);
        this.boardLayoutChangedCallback(this.layout);
        this.diceSelectedCallback();
    }

    public selectDice(position: number) {
        let dice = this.layout.find((e) => e.position === position);
        if (!dice) {
            return;
        }
        // Check if dice is allowed to be pressed
        if (!this.allowedDicePress(dice)) {
            // Dice is not allowed to be (de)selected
            return;
        }
        dice.toggle();
        if (dice.selected) {
            // Add to pressed dice
            this.selectedDice.push(dice);
        } else {
            // Remove from pressed dice, if it was the last selected one
            this.selectedDice = this.selectedDice.filter(
                (_dice) => _dice.position !== dice.position
            );
        }
        this.setLayout(this.layout);
        this.diceSelectedCallback();
    }

    public getSelectedDiceAsString() {
        return this.selectedDice.map((dice) => dice.value).join("");
    }

    protected setLayout(layout: Dice[]) {
        this.layout = layout;
        if (this.boardLayoutChangedCallback) {
            this.boardLayoutChangedCallback(this.layout);
        }
    }

    private allowedDicePress(dice: Dice): boolean {
        let lastSelectedDice = this.selectedDice[this.selectedDice.length - 1];
        if (!lastSelectedDice) {
            // This is the first dice to be selected
            return true;
        }
        if (dice.selected && dice.position !== lastSelectedDice.position) {
            // If dice is selected (deselect request) but it's not the last selected dice, return false
            return false;
        }
        if (this.selectedDice.length > this.layout.length) {
            return false;
        }
        if (dice.position > this.layout.length) {
            return false;
        }
        const position_dif = Math.abs(dice.position - lastSelectedDice.position);
        if (!this.allowedPositionDiffs.includes(position_dif)) {
            return false;
        }
        return true;
    }
}