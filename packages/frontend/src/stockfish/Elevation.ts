import sumBy from 'lodash/sumBy';
import { StockfishLine } from './Model';
const round = (n: number, digit = 2) => {
    return +n.toFixed(digit);
};
export function calculateWinChange1(centipawns: number) {
    const chance = Math.max(
        0,
        Math.min(100, 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1))
    );
    return round(chance);
}

export function calculateWinChange(centipawns: number) {
    const k = 0.004; // Steepness of the curve
    const x0 = 0;    // Midpoint for 50% probability

    const rawChance = 1 / (1 + Math.exp(-k * (centipawns - x0)));
    const chancePercentage = rawChance * 100;

    // Ensure the chance is clamped between 0 and 100 and rounded
    return Math.max(0, Math.min(100, Math.round(chancePercentage)));
}

export function calculateAccuracy(
    winPercentBefore: number,
    winPercentAfter: number
) {
    const accuracy = Math.max(
        0,
        Math.min(
            100,
            103.1668 * Math.exp(-0.04354 * (winPercentBefore - winPercentAfter)) -
            3.1669
        )
    );
    return round(accuracy);
}

export function estimatePlayPerfomance(lines: StockfishLine[]) {
    const cpLines = lines.filter((x) => x.score.type === 'cp');
    const totalCP = sumBy(cpLines, (x) =>
        Math.max(Math.min(400, x.score.value), -400)
    );
    const avgCPChange = totalCP / cpLines.length;
    // const lowestCP = -400
    // const highestCP = 400
    const lowestElo = 200;
    const highestElo = 3000;
    const percentage = (avgCPChange + 400) / 800;
    const elo = percentage * (highestElo - lowestElo) + lowestElo;
    return +elo.toFixed(0);

    //   Average Evaluation around +1.00: Estimated Elo rating of about 2000+
    // Average Evaluation around +0.50: Estimated Elo rating of about 1800-2000
    // Average Evaluation around +0.00: Estimated Elo rating of about 1600-1800
    // Average Evaluation around -0.50: Estimated Elo rating of about 1400-1600
    // Average Evaluation around -1.00: Estimated Elo rating of about 1200-1400
    // Average Evaluation around -1.50: Estimated Elo rating of about 1000-1200
    // Average Evaluation around -2.00: Estimated Elo rating of about 800-1000
    // Average Evaluation below -2.00: Estimated Elo rating of below 800
}
