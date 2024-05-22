
import { Move } from 'library';
import React from 'react';
interface MoveListProps {
    moves: Move[],
    delayedMoves?: number;
    maxHeight: number,
    onSelect: (index: number) => void, selectedIndex: number
}

const chunkArray = (arr: any[], size: number) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) {
            acc.push(arr.slice(i, i + size));
        }
        return acc;
    }, []);
};

function MoveList({ moves, onSelect, selectedIndex, maxHeight, delayedMoves }: MoveListProps) {
    const pairs = chunkArray(moves, 2)
    return (
        <div className="flex flex-col w-[300px] pt-3 pl-5  overflow-y-auto relative" style={{ height: maxHeight + 20 }}>
            {pairs.map((t: Move[], index: number) => (
                <div key={index} className="flex w-full justify border-b-indigo-400">
                    <div className={"mr-4 w-1/2 cursor-pointer hover:font-bold " + (selectedIndex == index * 2 ? 'font-bold' : '')} onClick={() => onSelect(index * 2)}>{index + 1}. {t[0].san}</div>
                    <div className={"mr-4 w-1/2 cursor-pointer hover:font-bold " + (selectedIndex == index * 2 + 1 ? 'font-bold' : '')} onClick={() => onSelect(index * 2 + 1)}>{t[1]?.san}</div>
                </div>
            ))
            }
            {delayedMoves && delayedMoves > 0 && <div className='bg-yellow-200 absolute bottom-0 p-2'>This game is live and move was delayed by <span className='font-bold'>{delayedMoves} </span>moves</div>}
        </div>
    );
}
export default MoveList;