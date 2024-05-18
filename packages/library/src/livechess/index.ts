import axios from "axios";
import { Game, LookupResult, RoundPairing, Tournament } from "./model";
import { Chess } from 'chess.js'

export class LiveChessTournament {
    private lookupResult?: LookupResult = undefined;
    private tournament?: Tournament = undefined;
    constructor(private  tournamentId: string){

    }
    public async fetchTournament() {
        if(this.tournament) {
            return this.tournament
        }
        const lookupUrl = "https://lookup.livechesscloud.com/meta/"+ this.tournamentId
        const {data:lookupData} = await axios.get<LookupResult>(lookupUrl);
        this.lookupResult = lookupData;
        const url = `https://${this.lookupResult.host}/get/${this.tournamentId}/tournament.json`

        const {data: tournamentData} = await axios.get<Tournament>(url);
        this.tournament = tournamentData;
        return tournamentData;
    }

    public async fetchRound(round: number) {
        const url =`https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/index.json`
        const {data} = await axios.get<RoundPairing>(url);
        return data;
    }

    public async fetchGame(round: number, game: number) {
        const url =`https://${this.lookupResult.host}/get/${this.tournamentId}/round-${round}/game-${game}.json?poll`
        const {data} = await axios.get<Game>(url);
        const chess = new Chess()
        const moves = [];
        for(const move of data.moves) {
            const [m, time] = move.split(' ')
            chess.move(m);
            moves.push([
                m, chess.fen(), time
            ])
        }
        return moves;
    }
}
