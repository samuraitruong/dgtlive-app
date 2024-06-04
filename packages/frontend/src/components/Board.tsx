import { Chessboard } from "react-chessboard";
import { Move } from "library";

export default function Board({ move, boardWidth, direction = 'white' }: { move: Move, boardWidth: number, direction?: 'black' | 'white' }) {
    return (
        <Chessboard
            boardOrientation={direction}
            boardWidth={boardWidth}
            position={move?.fen}
            showBoardNotation={true}
            areArrowsAllowed={true}
            arePiecesDraggable={false}
            customArrows={[move.arrow] as any} />
    )
}