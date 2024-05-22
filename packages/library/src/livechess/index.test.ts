import { describe, expect, test } from '@jest/globals';
import { LiveChessTournament } from '.';

const tournamentId = "c8087bf5-e192-4624-bc68-c0da149e0d4d"
const livechess = new LiveChessTournament(tournamentId);

describe('livechess test', () => {
    test('fetchTournament should successful return data', async () => {
        const result = await livechess.fetchTournament();
        expect(result).toMatchSnapshot();
    });

    test('fetchRound should successful return data', async () => {
        await livechess.fetchTournament();
        const result = await livechess.fetchRound(1)
        expect(result).toMatchSnapshot();
    });


    test('fetchGame should successful return data', async () => {
        await livechess.fetchTournament();
        const result = await livechess.fetchGame(1, 1)
        expect(result).toMatchSnapshot();
    });

});