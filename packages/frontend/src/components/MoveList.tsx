
import { Move } from 'library';
import React, { useMemo } from 'react';
import moment from 'moment'
import TimeBarChart from './TimeBarChart';

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

    const maxTime = useMemo(() => {
        let max = 0;
        for (const x of moves) {
            max = Math.max(x?.moveTime || 0, max)
        }
        return max;
    }, [moves])
    const formatTime = (m: Move) => {
        if (m?.movedAt) {
            return moment(m.movedAt).format()
        }
        return ""
    }
    return (
        <div className="flex flex-col w-full ml-0 md:ml-5  overflow-y-auto relative border border-solid border-red" style={{ height: maxHeight + 20 }}>
            <div className="flex w-full justify bg-slate-800 p-1 text-white">
                <div className='w-2/12'>No.</div>
                <div className="mr-4 w-3/12 cursor-pointer hover:font-bold">White</div>
                <div className="mr-4 w-3/12 cursor-pointer hover:font-bold">Black</div>
                <div className='w-4/12'></div>
            </div>

            {pairs.map((t: Move[], index: number) => (
                <div key={index} className="flex w-full justify border-b-indigo-400 p-1">
                    <div className={`w-2/12   ${(selectedIndex == (index * 2)) || (selectedIndex == (index * 2) + 1) ? ' font-bold' : ''}`}>{index + 1}.</div>
                    <div title={formatTime(t[0])} className={"mr-4 w-3/12 cursor-pointer hover:font-bold " + (selectedIndex == index * 2 ? 'font-bold' : '')} onClick={() => onSelect(index * 2)}> {t[0].san}</div>
                    <div title={formatTime(t[1])} className={"mr-4 w-3/12 cursor-pointer hover:font-bold " + (selectedIndex == index * 2 + 1 ? 'font-bold' : '')} onClick={() => onSelect(index * 2 + 1)}>{t[1]?.san}</div>
                    <div className='w-4/12'>
                        <TimeBarChart whiteTime={t[0].moveTime} blackTime={t[1]?.moveTime} maxTime={maxTime} />
                    </div>
                </div>
            ))
            }
            {delayedMoves && delayedMoves > 0 && <div className='bg-yellow-200 absolute bottom-0 p-2'>This game is live and move was delayed by <span className='font-bold'>{delayedMoves} </span>moves</div>}
        </div>
    );
}
export default MoveList;