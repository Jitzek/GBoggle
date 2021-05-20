import type { Socket } from "socket.io-client";
import type { Player } from "../Player";
import { Board, BoardFactory } from "./Board";
import { Writable, writable } from 'svelte/store';
import type { RoomSettings } from "../RoomSettings";

export class Game {
    client: Socket;
    board!: Board;
    players: Player[];
    playerId: string;
    playerScore: number = 0;
    settings: RoomSettings;

    inProgress: Writable<boolean> = writable(false);

    currentRound: Writable<number> = writable(1);
    nextRound: Writable<number> = writable(1);
    totalRounds: number;

    roundTimer: Writable<number> = writable(0);
    nextRoundTimer: Writable<number> = writable(0);;

    _foundWords: string[] = [];
    foundWords: Writable<string[]> = writable([]);

    playersWithFoundWords: Map<string, string[]>;
    playersWithDuplicateWords: Map<string, string[]>;
    playersWithScoreGained: Map<string, number>;

    duplicateWordsOfCurrentPlayerWithOtherPlayers: Writable<Map<string, Player[]>> = writable(new Map());
    scoreGainedOfCurrentPlayer: Writable<number> = writable(0);

    boardChangedCallback: (newBoard: Board) => void;
    playerScoreChangedCallback: {(newScore: number): void};

    constructor(client: Socket, players: Player[], settings: RoomSettings, playerId: string, totalRounds: number) {
        this.client = client;
        this.players = players;
        this.settings = settings;
        this.playerId = playerId;
        this.totalRounds = totalRounds;

        this.init();
    }

    public setBoardChangedCallback(callback: (newBoard: Board) => void) {
        this.boardChangedCallback = callback;
    }
    
    public setPlayerScoreChangedCallback(callback: {(newScore: number): void;}) {
        this.playerScoreChangedCallback = callback;
    }

    private init() {
        this.client.on("round_started", (layout: string[], round: number) => this.on_round_started(layout, round));
        this.client.on("round_ended",
            (nextRound: number, playersWithFoundWords: string, playersWithDuplicateWords: string, playersWithScoreGained: string) =>
                this.on_round_ended(nextRound, playersWithFoundWords, playersWithDuplicateWords, playersWithScoreGained)
        );
        this.client.on("round_timer_changed", (newRoundTime: number) => this.on_round_timer_changed(newRoundTime));
        this.client.on("next_round_timer_changed", (newNextRoundTime: number) => this.on_next_round_timer_changed(newNextRoundTime));
        this.client.on("word_validated", (word: string, valid: boolean, reason: string, score: number | undefined) => this.on_word_validated(word, valid, reason, score));
    }

    public start() {
        this.inProgress.set(true);
    }

    public stop() {
        this.inProgress.set(false);
    }

    public submitWord() {
        if (this.board.selectedDice.length < 1) return;
        let selectedDicePositions = this.board.selectedDice.map((dice) => dice.position);
        this.client.emit("submit_word", selectedDicePositions);

        // Reset dice selection
        this.board.deselectAllDice();
    }

    protected setBoard(board: Board) {
        this.board = board;
        this.boardChangedCallback(this.board);
    }

    private on_word_validated(word: string, valid: boolean, reason: string, score: number | undefined) {
        if (!valid) {
            console.log(`Word: ${word} was not valid, reason: ${reason}`);
            return;
        }
        console.log(`Word: ${word} was valid, reason: ${reason}`);
        this._foundWords.push(word);
        this.foundWords.set(this._foundWords);

        // Real-time score for current client if words don't have to be unique (no point deduction)
        if (this.settings.uniqueWordsOnly === false && score) {
            this.playerScore += score;
            this.playerScoreChangedCallback(this.playerScore);
        }
    }

    private on_round_started(layout: string[], round: number) {
        this._foundWords = [];
        this.foundWords.set(this._foundWords);
        this.setBoard(BoardFactory.getBoard(layout));
        this.currentRound.set(round);
    }

    private on_round_ended(nextRound: number, playersWithFoundWords: string, playersWithDuplicateWords: string, playersWithScoreGained: string) {
        this.nextRound.set(nextRound);
        if (playersWithFoundWords) {
            this.playersWithFoundWords = new Map<string, string[]>(JSON.parse(playersWithFoundWords));
        }
        if (playersWithDuplicateWords) {
            this.playersWithDuplicateWords = new Map<string, string[]>(JSON.parse(playersWithDuplicateWords));
            this.duplicateWordsOfCurrentPlayerWithOtherPlayers.set(this.getDuplicatedWordsWithPlayerIdsForCurrentPlayer());
        }
        if (playersWithScoreGained) {
            this.playersWithScoreGained = new Map<string, number>(JSON.parse(playersWithScoreGained));
            this.scoreGainedOfCurrentPlayer.set(this.playersWithScoreGained.get(this.playerId) || 0);
        }
        this.playerScoreChangedCallback(this.players.find((player) => player.uuid === this.playerId)?.score || 0);

    }

    private getDuplicatedWordsWithPlayerIdsForCurrentPlayer(): Map<string, Player[]> {
        const duplicate_word_with_player_ids = new Map<string, Player[]>();

        this.playersWithDuplicateWords.get(this.playerId).forEach((word) => {
            duplicate_word_with_player_ids.set(word, []);
            this.playersWithDuplicateWords.forEach((words: string[], player_id: string) => {
                if (words.includes(word)) {
                    duplicate_word_with_player_ids.get(word)?.push(this.players.find((player) => player_id === player.uuid));
                }
            });
        });

        return duplicate_word_with_player_ids;
    }

    private on_round_timer_changed(newRoundTime: number) {
        this.roundTimer.set(newRoundTime);
    }

    private on_next_round_timer_changed(newNextRoundTimer: number) {
        this.nextRoundTimer.set(newNextRoundTimer);
    }
}