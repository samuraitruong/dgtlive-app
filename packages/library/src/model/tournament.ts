export interface Tournament{
    name: string;
    location: string;
    rounds: Round[]
}
export interface Round{
    date: string;
    pairs: Pair[]
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
    [x:string]: GameEventResponse
}


export interface GameEventResponse{
    isLive: boolean;
    round: number,
    game: number;
    moves: Move[]
}