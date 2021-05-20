import type { Socket } from "socket.io-client";

export class RoomSettings {
    client: Socket;
    rounds: number = 1;
    roundTime: number = 30;
    language: string = "Dutch";
    uniqueWordsOnly: boolean = true;

    settingsChangedCallback: (rounds: number, roundTime: number, language: string, uniqueWordsOnly: boolean) => void;

    constructor(client: Socket) {
        this.client = client;
        this.init();
    }

    private init() {
        this.client.on("settings_changed",
            (rounds: number, round_time: number, language: string, unique_words_only: boolean) =>
                this.on_settings_changed(rounds, round_time, language, unique_words_only)
        );

    }

    public setSettingsChangedCallback(callback: (rounds: number, roundTime: number, language: string, uniqueWordsOnly: boolean) => void) {
        this.settingsChangedCallback = callback
    }

    public changeRounds(newRounds: number) {
        this.client.emit("rounds_setting_changed", newRounds);
    }

    public changeRoundTime(newRoundTime: number) {
        this.client.emit("round_time_setting_changed", newRoundTime);
    }

    public changeLanguage(newLanguage: string) {
        this.client.emit("language_setting_changed", newLanguage);
    }

    public changeUniqueWordsOnly(newUniqueWordsOnly: boolean) {
        this.client.emit("unique_words_only_setting_changed", newUniqueWordsOnly);
    }

    private on_settings_changed(rounds: number, round_time: number, language: string, unique_words_only: boolean) {
        this.rounds = rounds;
        this.roundTime = round_time;
        this.language = language;
        this.uniqueWordsOnly = unique_words_only;

        if (this.settingsChangedCallback) {
            this.settingsChangedCallback(this.rounds, this.roundTime, this.language, this.uniqueWordsOnly);
        }
    }
}