import type { Socket } from "socket.io-client";
import { ObservableValue } from "src/utils/ObservableValue";

export class RoomSettings {
    client: Socket;
    rounds = new ObservableValue<number>(1);
    roundTime = new ObservableValue<number>(30);
    language = new ObservableValue<string>("Dutch");
    uniqueWordsOnly = new ObservableValue<boolean>(true);

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
        this.rounds.set(rounds);
        this.roundTime.set(round_time);
        this.language.set(language);
        this.uniqueWordsOnly.set(unique_words_only)
    }
}