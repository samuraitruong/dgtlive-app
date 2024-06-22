export interface StockfishLine {
    winChance: number;
    pv: string;
    depth: number;
    multipv: number;
    nodes: number;
    score: {
        value: number;
        type: string;
    };
}

// export interface ReviewedMove extends EnrichedMove {
//     best: ReviewedMoveOutput;
//     playedMove: ReviewedMoveOutput;
// }

export interface BestMoveOutput {
    bestmove: string;
    ponder: string;
    lines: StockfishLine[];
    bestLine?: any,//;
    position?: string;
}