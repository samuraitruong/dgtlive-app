
import { Move } from 'library';
import React from 'react';
interface MoveListProps {
    moves: Move[],
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

function MoveList({ moves , onSelect, selectedIndex, maxHeight}: MoveListProps) {
    const pairs = chunkArray(moves, 2)
    return (
        <div className="flex flex-col  w-[300px] pt-3 pl-5  overflow-y-auto" style={{maxHeight: maxHeight}}>
            {pairs.map((t: Move[], index: number) => (
                <div key={index} className="flex w-full justify border-b-indigo-400">
                    <div className={"mr-4 w-1/2 cursor-pointer hover:font-bold " + (selectedIndex == index *2?'font-bold':'')} onClick={() => onSelect(index *2)}>{index + 1}. {t[0].san}</div>
                    <div className={"mr-4 w-1/2 cursor-pointer hover:font-bold " + (selectedIndex == index *2 + 1?'font-bold':'')} onClick={() => onSelect(index *2 +1)}>{t[1]?.san}</div>
                </div>
            ))
            }
        </div>
    );
}
export default MoveList;