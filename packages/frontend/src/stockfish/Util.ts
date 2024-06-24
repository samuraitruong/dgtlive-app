import { Chess, PieceSymbol } from 'chess.js';
import { StockfishLine } from './Model';

export function partitionListIntoPairs<T>(arr: T[]): Array<T[]> {
    return arr.reduce((result, current, index) => {
        if (index % 2 === 0) {
            result.push([current]);
        } else {
            result[Math.floor(index / 2)].push(current);
        }
        return result;
    }, [] as Array<T[]>);
}

export function findPiecePosition(
    fen: string,
    color: 'b' | 'w',
    piece: PieceSymbol
) {
    const game = new Chess(fen);
    const board = game.board();

    const results = board.flatMap((row) =>
        row.filter((c) => c?.color === color && c.type === piece)
    );
    return results;
}

// export function sortStockfishLine(line1: StockfishLine, line2: StockfishLine) {
//     if (line1.score.value === line2.score.value) {
//         return line2.depth - line1.depth;
//     }
//     return line2.score.value - line1.score.value;
// }

export function sortStockfishLine(line1: StockfishLine, line2: StockfishLine) {
    const score1 = line1.score;
    const score2 = line2.score;

    if (score1.type === 'mate' && score2.type === 'mate') {
        // Both scores are mate distances
        // Smaller positive mate distance is better (closer to win)
        return score1.value - score2.value;
    } else if (score1.type === 'mate') {
        // Mate scores should come before cp scores
        return -1;
    } else if (score2.type === 'mate') {
        // Mate scores should come before cp scores
        return 1;
    } else {
        // Both scores are centipawn values
        if (score1.value === score2.value) {
            // If centipawn values are the same, sort by depth
            return line2.depth - line1.depth;
        }
        // Higher centipawn value is better
        return score2.value - score1.value;
    }
}
