declare type ObservableIdentifier = number;

export class ObservableValue<T> {
    private _value: T;
    private _callbacks = new Map<ObservableIdentifier, {(value: T): void;}>();
    constructor(value: T) {
        this._value = value;
    }

    public get(): T {
        return this._value;
    }

    public set(value: T) {
        this._value = value;
        this.notify();
    }

    public update(callback: {(value: T): void;}) {
        callback(this._value);
        this.notify();
    }

    public subscribe(callback: {(value: T): void;}): ObservableIdentifier {
        // Get next available identifier
        const identifier: ObservableIdentifier = this._getAvailableIdentifier();

        this._callbacks.set(identifier, callback);

        // Initial callback
        callback(this._value);

        return identifier;
    }

    private _getAvailableIdentifier(identifier: number = 0): ObservableIdentifier {
        if (this._callbacks.has(identifier)) return this._getAvailableIdentifier(identifier + 1);
        return identifier;
    }
    
    public unsubscribe(identifier: ObservableIdentifier) {
        this._callbacks.delete(identifier);
    }

    public notify() {
        this._callbacks.forEach(callback => {
            callback(this._value);
        });
    }
}