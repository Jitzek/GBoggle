export class Dice {
    value: string;
    position: number;
    selected: boolean;

    constructor(value: string, position: number, selected: boolean) {
        this.value = value;
        this.position = position;
        this.selected = selected;
    }

    public toggle() {
        this.selected = !this.selected;
    }
}