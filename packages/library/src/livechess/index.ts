import axios from "axios";
import { Chess } from 'chess.js'
import { GameData, LookupResultData, RoundPairingData, TournamentData } from "./model";

export class LiveChessTournament {
    private lookupResult?: LookupResultData = undefined;
    private tournament?: TournamentData = undefined;
    private refreshTimeAt = -1;
    constructor(private tournamentId: string) {

    }
    public async fetchTournament(force: boolean = false) {
        if (this.tournament && this.refreshTimeAt < new Date().getTime() && !force) {
            return this.tournament
        }
        const lookupUrl = "https://lookup.livechesscloud.com/meta/" + this.tournamentId
        const { data: lookupData } = await axios.get<LookupResultData>(lookupUrl);
        this.lookupResult = lookupData;
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/tournament.json`

        const { data: tournamentData } = await axios.get<TournamentData>(url);
        this.tournament = tournamentData;
        this.refreshTimeAt = new Date().getTime() + 60000;
        return tournamentData;
    }

    public async fetchRound(round: number) {
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/index.json`
        const { data } = await axios.get<RoundPairingData>(url);
        return data;
    }

    public async fetchGame(round: number, game: number) {
        if (!this.tournament) {
            await this.fetchTournament()
        }
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/game-${game}.json?poll`
        const { data } = await axios.get<GameData>(url);
        const chess = new Chess()
        const moves = [];
        for (const move of data.moves) {
            const [m, time] = move.split(' ')
            var m1 = chess.move(m);
            moves.push([
                m, chess.fen(), time, m1.from, m1.to
            ])
        }
        return { moves, live: data.live };
    }
}
