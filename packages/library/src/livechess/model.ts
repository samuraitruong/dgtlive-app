export interface LookupResultData {
    host: string;
    format: string;
}

export interface TournamentData {
    id: string;
    name: string;
    location: string;
    country: string;
    website: string;
    rules: string;
    chess960: string;
    timecontrol: string;
    rounds: RoundData[];
    eboards: string[];
}

export interface RoundData {
    count: number;
    live: number;
}


export interface RoundPairingData {
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


export interface GameData{
    live: boolean;
    serialNr: string;
    firstMove: number;
    chess960: number;
    result: string;
    comment: string;
    clock: string;
    moves: string[]
}