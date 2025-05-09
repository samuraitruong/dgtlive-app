import axios from "axios";
import { Chess } from 'chess.js'
import { GameData, LookupResultData, RoundPairingData, TournamentData } from "./model";

import axiosRetry from 'axios-retry';

// import fs from 'fs'
const axiosInstance = axios.create();

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => {
        // Return a successful response
        return response;
    },
    error => {
        // Log the error and the URL
        console.error('Request failed with URL:', error.config.url);
        return Promise.reject(error);
    }
);

axiosRetry(axiosInstance, { retries: 3 })

export class LiveChessTournament {
    private lookupResult?: LookupResultData = undefined;
    private tournament?: TournamentData = undefined;
    constructor(private tournamentId: string) {

    }
    public async setGame(id: string) {
        this.tournamentId = id;
    }
    public async fetchTournament() {
        const lookupUrl = "https://lookup.livechesscloud.com/meta/" + this.tournamentId
        const { data: lookupData } = await axiosInstance.get<LookupResultData>(lookupUrl);
        this.lookupResult = lookupData;
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/tournament.json`
        const { data: tournamentData } = await axiosInstance.get<TournamentData>(url);
        this.tournament = tournamentData;
        return tournamentData;
    }

    public async fetchRound(round: number) {
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/index.json`
        const { data } = await axiosInstance.get<RoundPairingData>(url);
        return data;
    }

    public async fetchGame(round: number, game: number) {
        if (!this.tournament) {
            await this.fetchTournament()
        }
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/game-${game}.json?poll`

        const { data } = await axiosInstance.get<GameData>(url);
        // fs.writeFileSync('debug.json', JSON.stringify(data, null, 2))
        const chess = new Chess()

        const moves = [];
        for (const move of data.moves) {
            try {
                const [m, time] = move.split(' ')
                const m1 = chess.move(m);
                moves.push([
                    m, chess.fen(), time, m1.from, m1.to
                ])
            }
            catch (err) {
                console.log(err)
                break;
            }
        }
        data.result = data.result || "*"
        let live = data.live
        const gameEndedResults = ['BLACKWIN', 'WHITEWIN', 'DRAW'];
        if (live && data.result && !gameEndedResults.includes(data.result)) {
            live = false
        }

        if (!live && (data.result === "*" || data.result === null)) {
            live = true
        }
        return { moves, live, startedAt: data.firstMove, result: data.result, clock: data.clock };
    }
}
