import { Chessboard } from "react-chessboard";
import { Move } from "library";
import { BestMoveOutput } from "@/stockfish/Model";
import { EloBar } from "./EloBar";
interface BoardProps {
    move: Move, boardWidth: number, direction?: 'black' | 'white',
    bestMove?: BestMoveOutput
}
export default function Board({ move, boardWidth, direction = 'white', bestMove }: BoardProps) {

    return (
        <div className="relative">
            {bestMove && <div className="absolute left-[-27px] top-0 "><EloBar bestMoveResult={bestMove} height={boardWidth} direction={direction} /></div>}
            <Chessboard
                customBoardStyle={{ borderRadius1: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5 ' }}
                customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)' }}
                customLightSquareStyle={{ backgroundColor: '#eff6ff' }}
                customDarkSquareStyle={{ backgroundColor: '#3b82f6' }}
                boardOrientation={direction}
                boardWidth={boardWidth}
                position={move?.fen}
                showBoardNotation={true}
                areArrowsAllowed={true}
                arePiecesDraggable={false}
                customArrows={move ? [move.arrow] as any : undefined} />

        </div>

    )
}