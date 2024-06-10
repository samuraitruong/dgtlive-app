import { GameEventResponse, Pair } from 'library';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoveList from './MoveList';
import GameController from './Controller'
import { useWindowSize } from '@uidotdev/usehooks';
import useKeyPress from '@/hooks/useKeyPress';
import Board from './Board';
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types';
import PlayerDisplay from './SmallPlayerDisplay';
import BigPlayerDisplay from './BigPlayerDisplay';
import { useFullscreen } from '@/hooks/useFullscreen';

interface GameViewerProps {
  data: GameEventResponse
  pair: Pair,
  tournamentName: string;
}

const GameViewer = ({ data: { moves, delayedMoves }, pair, tournamentName }: GameViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [fullscreen, toggleFullscreen] = useFullscreen();
  const { height } = useWindowSize()
  const [time, setTime] = useState({ black: -1, white: -1 });
  const [orientation, setOrientation] = useState<BoardOrientation>('white')
  const parentRef = useRef<HTMLDivElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);
  const onBoardOrientationChanged = (d: BoardOrientation) => {
    console.log(d, orientation)
    setOrientation((prev) => prev === 'white' ? 'black' : 'white')
  }

  const handleNavigateStep = (step: number) => {
    let nextStep = currentIndex + step;
    if (step == Number.MIN_VALUE) {
      nextStep = 0;
    }

    if (step == Number.MAX_VALUE) {
      nextStep = moves.length - 1;
    }
    if (nextStep >= 0 && nextStep < moves.length)
      setCurrentIndex(nextStep);
  };

  useKeyPress('ArrowLeft', () => handleNavigateStep(-1))
  useKeyPress('ArrowRight', () => handleNavigateStep(1))
  useEffect(() => {
    if (currentIndex % 2 === 0) {
      setTime({
        white: moves[currentIndex]?.time || -1,
        black: moves[currentIndex - 1]?.time || -1
      })
    }
    else {
      setTime({
        white: moves[currentIndex - 1]?.time || -1,
        black: moves[currentIndex]?.time || -1
      })
    }
  }, [currentIndex, moves])

  useEffect(() => {
    setCurrentIndex(moves.length - 1)
  }, [moves])
  const boardWidth = useMemo(() => {

    const box1 = parentRef.current?.getClientRects()[0];
    const box2 = moveListRef.current?.getClientRects()[0];

    console.log("debug", box1, box2);

    const availableWidth = box1?.width || 0 - (box2?.width || 0) - 250; //margin
    let desiredHeight = 500;
    if (!height) {
      desiredHeight = 500
    }
    if (!fullscreen) {
      desiredHeight = (height || 500) - 160
    } else {
      desiredHeight = (height || 500) - 70
    }

    console.log("debug w, h", availableWidth, desiredHeight)
    return Math.min(desiredHeight, availableWidth);
  }, [height, fullscreen])

  return (
    <div className={fullscreen ? 'fixed top-0 left-0 h-screen w-screen bg-slate-200 z-100 text-black' : ''}>
      <div className={fullscreen ? 'flex justify-center' : 'flex justify-center'} ref={parentRef}>
        {fullscreen && <div className='flex p-10 items-center justify-center align-middle h-100 flex-col relative'>
          <h2 className='mb-10 p-2 text-ellipsis text-wrap text-4xl text-center absolute top-0 font-bold bg-slate-800  text-white'>{tournamentName}</h2>

          <BigPlayerDisplay pair={pair} time={time} color={orientation === 'white' ? 'black' : 'white'} />
          <div className="flex items-center justify-center mt-20 mb-20 size-10 text-6xl font-semibold">vs</div>
          <BigPlayerDisplay pair={pair} time={time} color={orientation} reverse={true} />

          <div className='p-5 text-6xl mt-5 absolute bottom-0 font-bold'>{pair.result}</div>
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

          <GameController navigateByStep={handleNavigateStep}
            onBoardOrientationChanged={onBoardOrientationChanged}
            currentIndex={currentIndex}
            total={moves.length}
            handleMaxSize={toggleFullscreen} />
        </div>
        <div ref={moveListRef}>

          <MoveList maxHeight={boardWidth} moves={moves} onSelect={(i) => setCurrentIndex(i)} selectedIndex={currentIndex} delayedMoves={delayedMoves} />
          {!fullscreen && <div className='text-3xl mt-5 w-full bottom-0 font-bold text-center'>{pair.result}</div>}
        </div>
      </div>
    </div>
  );
};

export default GameViewer;
