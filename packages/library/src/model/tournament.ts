export interface Tournament {
    name: string;
    location: string;
    rounds: Round[]
}
export interface Round {
    index?: number;
    date: string;
    live?: boolean;
    pairs: Pair[];
}

export interface Pair {
    white: string;
    black: string;
    result: string;
    live: boolean
}
export interface Move {
    san: string;
    fen: string;
    time: number;
    arrow: string[]
}

export type GameMap = {
    [x: string]: GameEventResponse
}


export interface GameEventResponse {
    isLive: boolean;
    delayedMoves?: number;
    round: number,
    game: number;
    moves: Move[]
}