export interface Tournament {
    name: string;
    title: string;
}
export interface LookupResult {
    host: string;
    format: string;
}

export interface Tournament {
    id: string;
    name: string;
    location: string;
    country: string;
    website: string;
    rules: string;
    chess960: string;
    timecontrol: string;
    rounds: Round[];
    eboards: string[];
}

export interface Round {
    count: number;
    live: number;
}


export interface RoundPairing {
    date: Date;
    pairings: Pairing[];
}

export interface Pairing {
    white: Player;
    black: Player;
    result: string;
    live: boolean;
}

export interface Player {
    fname: string;
    mname: null;
    lname: string;
    title: null;
    federation: null;
    gender: null | string;
    fideid: null;
}


export interface Game {
    live: boolean;
    serialNr: string;
    firstMove: number;
    chess960: number;
    result: string;
    comment: string;
    clock: string;
    moves: string[]
}