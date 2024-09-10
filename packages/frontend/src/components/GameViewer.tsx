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
import { useStockfish } from '@/hooks/useStockfish';
import { Chess } from "chess.js";
import { Tournament } from 'library';

interface GameViewerProps {
  data: GameEventResponse
  pair: Pair,
  tournament: Tournament
}

const GameViewer = (props: GameViewerProps) => {

  console.log("props", props)
  const { data: { moves, delayedMoves, isLive, round, game }, pair, tournament } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, toggleFullscreen] = useFullscreen();
  const { height, width } = useWindowSize()
  const [time, setTime] = useState({ black: -1, white: -1 });
  const [orientation, setOrientation] = useState<BoardOrientation>('white')
  const parentRef = useRef<HTMLDivElement>(null);
  const moveListRef = useRef<HTMLDivElement>(null);
  const onBoardOrientationChanged = (d: BoardOrientation) => {
    setOrientation((prev) => prev === 'white' ? 'black' : 'white')
  }
  const { engine, bestMoveResult } = useStockfish();
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

    const move = moves[currentIndex]
    if (move && !isLive) {
      engine?.findBestMove(move.fen)
    }
  }, [currentIndex, moves, engine, isLive])

  const showBestMove = useMemo(() => !isLive ? bestMoveResult : undefined, [bestMoveResult, isLive])

  useEffect(() => {
    setCurrentIndex(moves.length - 1)
  }, [moves])

  const { boardWidth, availableHeight } = useMemo(() => {

    const box1 = parentRef.current?.getClientRects()[0];
    const box2 = moveListRef.current?.getClientRects()[0];

    const availableWidth = box1?.width || 0 - (box2?.width || 0) - 400; //margin
    let desiredHeight = 500;
    if (!height) {
      desiredHeight = 500
    }
    if (!fullscreen) {
      desiredHeight = (height || 500) - 160
    } else {
      desiredHeight = (height || 500) - 170
    }

    let boardWidth = Math.min(desiredHeight, availableWidth)
    let availableHeight = boardWidth;
    if (fullscreen) {
      availableHeight = (box1?.height || 0);
    }
    if (width && width < 672) {
      boardWidth = width - 14;
    }
    else if (width && width < 1024) {
      boardWidth = boardWidth - 300;

    }
    return { boardWidth, availableHeight }
  }, [height, fullscreen, width])

  const downloadPgn = () => {
    const chess = new Chess();
    chess.header("Event", tournament.name);
    chess.header("Site", tournament.location);
    chess.header("Board", game.toString());
    chess.header("Date", tournament.rounds[round - 1].date);
    chess.header("Round", round.toString());
    chess.header("White", pair.white.name);
    chess.header("Black", pair.black.name);

    chess.header("WhiteElo", pair.white.elo as unknown as string);
    chess.header("BlackElo", pair.black.elo as unknown as string);
    chess.header("Result", pair.result)
    for (const m of moves) {
      chess.move(m.san);
    }

    const blob = new Blob([chess.pgn()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${pair.white.name}-${pair.black.name} ${pair.result}.pgn`;
    a.click();

    URL.revokeObjectURL(url); // Clean up the URL object

  }

  return (
    <div className={fullscreen ? 'fixed top-[50px] left-0 h-screen w-screen bg-slate-200 z-100 text-black pt-1' : ''}>
      <div className={fullscreen ? 'flex justify-center border-red-400 border-solid border-1' : 'flex  flex-col md:flex-row justify-center p-2 md:p-0'} ref={parentRef}>
        {fullscreen && <div className='flex p-10 items-center justify-center align-middle h-100 flex-col relative'>

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
          {/* {fullscreen && <h2 className='mb-10 p-2 text-ellipsis text-wrap text-4xl text-center absolute top-0 font-bold bg-slate-800  text-white'>{tournamentName}</h2>} */}

          <Board move={moves[currentIndex]} boardWidth={boardWidth} direction={orientation} bestMove={showBestMove} />

          {!fullscreen &&
            <PlayerDisplay pair={pair} time={time} color={orientation} />
          }
          <div className={fullscreen ? 'pt-10' : ''}>
            <GameController
              handleDownload={downloadPgn}
              navigateByStep={handleNavigateStep}
              onBoardOrientationChanged={onBoardOrientationChanged}
              currentIndex={currentIndex}
              total={moves.length}
              handleMaxSize={toggleFullscreen} />
          </div>
        </div>
        <div ref={moveListRef} className='w-full md:w-[300px] mt-5 md:mt-0'>

          <MoveList maxHeight={availableHeight} moves={moves} onSelect={(i) => setCurrentIndex(i)} selectedIndex={currentIndex} delayedMoves={delayedMoves} />
          {!fullscreen && !isLive && <div className='text-3xl mt-5 w-full bottom-0 font-bold text-center'>{pair?.result}</div>}
        </div>
      </div>
      {/* <div className='fixed  bg-slate-700 text-white opacity-90 bottom-[100px] p-5 w-full'>
        boardWidth = {boardWidth} <br />

        w = {width}<br />

        {JSON.stringify(parentRef.current?.getClientRects()[0])}

        <br />
        {JSON.stringify(moveListRef.current?.getClientRects()[0])}
      </div> */}
    </div>
  );
};

export default GameViewer;
