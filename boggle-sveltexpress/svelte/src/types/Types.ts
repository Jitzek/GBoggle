export type RoomProperties = {
    id: string;
    isLocked: boolean;
    name:string;
    lang: string;
    totalPlayers: number;
    maxPlayers: number;
}

export type PlayerScores = {
    name: string;
    score: number;
}
