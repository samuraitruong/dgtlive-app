import { GameEventResponse, Pair } from 'library';
import React, { useEffect, useMemo, useState } from 'react';
import MoveList from './MoveList';
import GameController from './Controller'
import { useWindowSize } from '@uidotdev/usehooks';
import useKeyPress from '@/hooks/useKeyPress';
import Board from './Board';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';
import PlayerDisplay from './SmallPlayerDisplay';
import BigPlayerDisplay from './BigPlayerDisplay';

interface GameViewerProps {
  data: GameEventResponse
  pair: Pair,
  tournamentName: string;
}

const GameViewer = ({ data: { moves, delayedMoves }, pair, tournamentName }: GameViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const { height } = useWindowSize()
  const [time, setTime] = useState({ black: -1, white: -1 });
  const [orientation, setOrientation] = useState<BoardOrientation>('white')

  const onBoardOrientationChanged = (d: BoardOrientation) => {
    setOrientation(d)
  }

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
        black: moves[currentIndex - 1]?.time || -1
      })
    }
    else {
      setTime({
        white: moves[currentIndex - 1].time,
        black: moves[currentIndex].time
      })
    }
  }, [currentIndex, moves])

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
    <div className={fullscreen ? 'fixed top-0 left-0 h-screen w-screen bg-slate-200 z-100 text-black' : ''}>
      <div className={fullscreen ? 'flex justify-center' : 'flex justify-center'}>
        {fullscreen && <div className='flex p-5 items-center justify-center align-middle h-100 flex-col mr-10 relative'>
          <h2 className='mb-10 text-ellipsis text-wrap text-4xl text-center absolute top-0 font-bold '>{tournamentName}</h2>

          <BigPlayerDisplay pair={pair} time={time} color={orientation === 'white' ? 'black' : 'white'} />
          <div className="flex items-center justify-center mt-20 mb-20 size-10 text-6xl font-semibold">vs</div>
          <BigPlayerDisplay pair={pair} time={time} color={orientation} reverse={true} />
        </div>
        }
        <div>
          {!fullscreen &&
            <PlayerDisplay pair={pair} time={time} color={orientation === 'white' ? 'black' : 'white'} />

          }
          <Board move={moves[currentIndex]} boardWidth={boardWidth} direction={orientation} />

          {!fullscreen &&
            <PlayerDisplay pair={pair} time={time} color={orientation} />
          }

          <GameController handleNextMove={handleNextMove}
            onBoardOrientationChanged={onBoardOrientationChanged}
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
