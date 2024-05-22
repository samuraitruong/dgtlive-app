import { GameEventResponse, Pair } from 'library';
import React, { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import Clock from './Clock';
import MoveList from './MoveList';
import GameController from './Controller'
import { useWindowSize } from '@uidotdev/usehooks';
import { FaChessKing } from "react-icons/fa";
import { FaRegChessKing } from "react-icons/fa6";
import useKeyPress from '@/hooks/useKeyPress';

interface GameViewerProps {
  data: GameEventResponse
  pair: Pair
}

const GameViewer = ({ data: { moves, delayedMoves }, pair }: GameViewerProps) => {
  console.log("moves", moves)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const { height } = useWindowSize()
  const [time, setTime] = useState({ black: 0, white: 0 });


  const handlePrevMove = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextMove = () => {
    if (currentIndex < moves.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useKeyPress('ArrowLeft', handlePrevMove)
  useKeyPress('ArrowRight', handleNextMove)
  useEffect(() => {
    if (currentIndex % 2 === 0) {
      setTime({
        white: moves[currentIndex].time,
        black: moves[Math.max(1, currentIndex - 1)].time
      })
    }
    else {
      setTime({
        white: moves[currentIndex - 1].time,
        black: moves[currentIndex].time
      })
    }
  }, [currentIndex])

  useEffect(() => {
    setCurrentIndex(moves.length - 1)
  }, [moves])
  const boardWidth = useMemo(() => {
    if (!height) {
      return 500
    }
    if (!fullscreen) {
      return height - 160
    }
    return height - 50
  }, [height, fullscreen])
  return (
    <div className={fullscreen ? 'fixed top-0 left-0 h-screen w-screen p-2 bg-slate-200 z-100 text-black' : ''}>
      <div className={fullscreen ? 'flex justify-center' : 'flex justify-center'}>
        {fullscreen && <div className='flex p-5 items-center justify-center align-middle h-100 flex-col mr-10'>
          <div className="flex items-center justify-center text-4xl">
            <div className="flex justify-between flex-col">
              <div className='font-bold mb-5'>
                <FaChessKing className='inline' />{pair.black}
              </div>
              <div className='flex justify-around'>
                <Clock time={time.black} ></Clock>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-20 mb-20 size-10 text-6xl font-semibold">vs</div>
          <div className="flex items-center justify-center text-4xl">

            <div className="flex justify-between flex-col">
              <div className='font-bold mb-5'>
                <FaRegChessKing className='inline' />{pair.white}
              </div>
              <div className='flex justify-around'>
                <Clock time={time.white} ></Clock>
              </div>
            </div>

          </div>
        </div>}
        <div>
          {!fullscreen &&
            <div className="flex justify-between">
              <div className='font-bold'>
                <FaChessKing className='inline' />{pair.black}
              </div>
              <Clock time={time.black} ></Clock>
            </div>
          }
          <Chessboard
            boardWidth={boardWidth}
            position={moves[currentIndex].fen}
            showBoardNotation={true}
            areArrowsAllowed={true}
            arePiecesDraggable={false}
            customArrows={[moves[currentIndex].arrow] as any}

          />
          {!fullscreen &&
            <div className="flex justify-between">
              <div className='font-bold'>
                <FaRegChessKing className='inline' />{pair.white}
              </div>
              <Clock time={time.white} ></Clock>
            </div>}

          <GameController handleNextMove={handleNextMove}
            handlePrevMove={handlePrevMove}
            currentIndex={currentIndex}
            total={moves.length}
            handleMaxSize={() => setFullscreen(!fullscreen)} />
        </div>
        <div>

          <MoveList maxHeight={boardWidth} moves={moves} onSelect={(i) => setCurrentIndex(i)} selectedIndex={currentIndex} delayedMoves={delayedMoves} />
        </div>
      </div>
    </div>
  );
};

export default GameViewer;
