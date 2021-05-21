import { ObservableValue } from "src/utils/ObservableValue";
import { Dice } from "./Dice";

export class BoardFactory {
    constructor() { }

    static getBoard(layout: string[]): Board {
        const _layout: Dice[] = [];
        layout.forEach((letter, i) => {
            _layout.push(new Dice(letter, i, false));
        });
        return new Board(_layout);
    }
}

export class Board {
    layout = new ObservableValue<Dice[]>([]);
    selectedDice: Dice[] = [];
    allowedPositionDiffs = [0, 1, 3, 4, 5];

    constructor(layout: Dice[]) {
        this.layout.set(layout);
    }

    public deselectAllDice() {
        this.selectedDice = [];
        this.layout.update((layout) => {
            layout.forEach((dice: Dice) => dice.selected = false);
        });
    }

    public selectDice(position: number) {
        this.layout.update((layout) => {
            let dice = layout.find((e) => e.position === position);
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
        });

    }

    public getSelectedDiceAsString() {
        return this.selectedDice.map((dice) => dice.value).join("");
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
        if (this.selectedDice.length > this.layout.get().length) {
            return false;
        }
        if (dice.position > this.layout.get().length) {
            return false;
        }
        const position_dif = Math.abs(dice.position - lastSelectedDice.position);
        if (!this.allowedPositionDiffs.includes(position_dif)) {
            return false;
        }
        return true;
    }
}