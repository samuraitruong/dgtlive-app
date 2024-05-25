import axios from "axios";
import { Chess } from 'chess.js'
import { GameData, LookupResultData, RoundPairingData, TournamentData } from "./model";

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
        console.log("lookupUrl", lookupUrl)
        this.lookupResult = lookupData;
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/tournament.json`
        console.log("url", url)
        const { data: tournamentData } = await axiosInstance.get<TournamentData>(url);
        this.tournament = tournamentData;
        return tournamentData;
    }

    public async fetchRound(round: number) {
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/index.json`
        console.log("round", url)
        const { data } = await axiosInstance.get<RoundPairingData>(url);
        return data;
    }

    public async fetchGame(round: number, game: number) {
        if (!this.tournament) {
            await this.fetchTournament()
        }
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/game-${game}.json?poll`

        console.log("fetch game", url)
        const { data } = await axiosInstance.get<GameData>(url);
        const chess = new Chess()
        const moves = [];
        for (const move of data.moves) {
            const [m, time] = move.split(' ')
            const m1 = chess.move(m);
            moves.push([
                m, chess.fen(), time, m1.from, m1.to
            ])
        }
        return { moves, live: data.live };
    }
}
