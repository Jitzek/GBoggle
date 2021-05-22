import type { Socket } from "socket.io-client";
import { Chat } from "./chat/Chat";
import { Game } from "./game/Game";
import { Player } from "./Player";
import { RoomSettings } from "./RoomSettings";
import type { User } from "./User";
import { Writable, writable } from 'svelte/store';
import { ObservableValue } from "src/utils/ObservableValue";

export enum RoomState {
    LOBBY,
    INGAME
}

export enum GameType {
    SINGLEPLAYER,
    MULTIPLAYER
}

export class Room {
    user: User;
    uuid: string;
    client: Socket;
    playerId!: string;
    players = new ObservableValue<Player[]>([]);
    roomSettings: RoomSettings;
    game = new ObservableValue<Game>(null);
    state: Writable<RoomState>;
    chat!: Chat;

    hostId!: string;

    joined: boolean = false;
    exists!: boolean;
    passwordProtected: Writable<boolean> = writable(false);
    gametype!: GameType;

    passwordWasIncorrect = new ObservableValue<boolean>(false);
    connectionStatus = new ObservableValue<boolean>(false);
    gameInProgress = new ObservableValue<boolean>(false);

    playingVictoryAudio = new Audio();

    constructor(client: Socket, roomUUID: string, user: User) {
        this.uuid = roomUUID;
        this.client = client;
        this.user = user;
        this.roomSettings = new RoomSettings(this.client);
        this.state = writable(RoomState.LOBBY);

        this.init();
    }

    private init() {
        this.client.on("disconnect", this.on_disconnect);
        this.client.on("room_information", (
            room_exists: boolean,
            room_is_password_protected: boolean,
            host_id: string,
            user_id: string,
            room_is_singleplayer: boolean
        ) => {
            if (!room_exists) {
                this.exists = false;
                return;
            }
            this.passwordProtected.set(room_is_password_protected);
            this.hostId = host_id;
            this.gametype = room_is_singleplayer ? GameType.SINGLEPLAYER : GameType.MULTIPLAYER;
            this.playerId = user_id;
            this.user.uuid = user_id;
            if (room_is_password_protected && host_id !== this.playerId) {
                return;
            }
            this.join("");
        });
        this.client.emit("room_information", this.uuid);
        this.client.on("incorrect_password", () => this.on_incorrect_password());

        this.client.on("invalid_name", (reason: string) => this.on_invalid_name(reason));
        this.client.on("invalid_avatar", (reason: string) => this.on_invalid_avatar(reason));
        this.client.on("invalid_victory_audio", (reason: string) => this.on_invalid_victory_audio(reason));

        this.client.on("joined", () => this.on_join());
    }

    public startGame() {
        this.client.emit("start_game");
    }

    public join(password: string) {
        this.client.emit("join_room", this.uuid, this.user.name, this.user.avatar, this.user.victoryAudio, password);
    }

    public submitScore() {
        this.client.emit("submit_score");
    }

    public backToMenu() {
        this.playingVictoryAudio.pause();
        this.playingVictoryAudio = new Audio();
        this.state.set(RoomState.LOBBY);
    }

    private on_game_started(totalRounds: number) {
        this.game.set(new Game(this.client, this.players, this.roomSettings, this.playerId, totalRounds));
        this.state.set(RoomState.INGAME);
        this.gameInProgress.set(true);
    }

    private on_game_ended(victoryAudio: string) {
        this.gameInProgress.set(false);
        if (this.game) {
            this.game.update((game) => {
                game.stop();
            });
        }
        this.playingVictoryAudio = new Audio(victoryAudio);
        this.playingVictoryAudio.volume = 0.5;
        setTimeout(() => {
            this.playingVictoryAudio.play();
        }, 1000);
    }

    private on_join() {
        this.client.on("game_started", (totalRounds: number) => this.on_game_started(totalRounds));
        this.client.on("game_ended", (victoryAudio: string) => this.on_game_ended(victoryAudio));
        this.client.on("player_joined", (uuid: string, name: string, avatar: string, score: number) =>
            this.on_player_joined(uuid, name, avatar, score)
        );
        this.client.on("player_removed", (uuid: string) => this.on_player_removed(uuid));
        this.client.on("player_score_changed", (uuid: string, score: number) => this.on_player_score_changed(uuid, score));

        if (this.gametype === GameType.SINGLEPLAYER) {
            this.client.on("score_submitted", (success: boolean) => this.on_score_submitted(success));
        }

        this.joined = true;
        this.connectionStatus.set(this.joined);
        this.chat = new Chat(this.client, this.players);
    }

    private on_player_joined(uuid: string, name: string, avatar: string, score: number) {
        // this.players.push(new Player(uuid, name, avatar, score));
        this.players.update(players => {
            players.push(new Player(uuid, name, avatar, score));
        });
        this.updatePlayers();
    }

    private on_player_removed(uuid: string) {
        this.players.set(this.players.get().filter((player) => player.uuid !== uuid));
        this.updatePlayers();
    }

    private on_disconnect() {

    }

    private on_invalid_name(reason: string) {

    }

    private on_invalid_avatar(reason: string) {

    }

    private on_invalid_victory_audio(reason: string) {

    }

    private on_incorrect_password() {
        this.passwordWasIncorrect.set(false);
    }

    private on_player_score_changed(uuid: string, score: number) {
        this.players.update(players => players.find((player) => player.uuid === uuid).score = score);
        this.updatePlayers();
    }

    private on_score_submitted(success: boolean) {
        console.log("score submitted");
        console.log(success);
        if (!success) {
            console.log("Something went wrong while submitting score");
            return
        }
        this.backToMenu();
    }

    private updatePlayers() {
        // Order alphabetically
        this.players.update(players => players.sort((_p1: Player, _p2: Player) => _p1.name.localeCompare(_p2.name)));

        // Order by score
        this.players.update(players => players.sort((_p1: Player, _p2: Player) => {
            if (_p1.score == _p2.score) return 0;
            return _p1.score < _p2.score ? 1 : -1;
        }));
    }

    public getPlayerById(id: string): Player | undefined {
        return this.players.get().find(player => player.uuid === id);
    }
}