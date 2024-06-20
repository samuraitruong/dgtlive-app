import { Round } from 'library/src/model/tournament';
import { BiSolidChess } from "react-icons/bi";
import { CiStreamOn } from "react-icons/ci";
import React, { useMemo, useState } from 'react';
import { IoChevronUpCircleOutline } from "react-icons/io5";
import { MdOutlineExpandCircleDown } from "react-icons/md";
import { PiSelectionAllBold } from "react-icons/pi";

interface ScheduleProps {
  data: Round[];
  selectedRound: number;
  onSelect: (round: number, gameId: number) => void;
}

export default function Schedule({ data, onSelect, selectedRound }: ScheduleProps) {
  const [openRoundIndex, setOpenRoundIndex] = useState<number>(selectedRound);

  const sortedData = useMemo<Round[]>(() => {
    return [...data].reverse().map((x, index) => ({
      ...x, index: data.length - index
    }));
  }, [data]);

  const toggleRound = (index: number) => {
    setOpenRoundIndex(prevIndex => (prevIndex === index ? -1 : index));
  };

  return (
    <div className="max-h-screen overflow-y-auto pb-16">
      <h1 className="text-2xl font-bold mb-4 pl-2">Schedules</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {sortedData.map((item, index) => (
          <div
            key={index}
            className={"bg-gray-100 p-2 relative" + (item.live ? ' border border-green-500 bg-green-200' : '') + ' ' + (item.pairs.length === 0 ? 'opacity-35' : '')}
          >
            <div className='flex justify-between'>
              <h2 className="text-xl font-bold mb-2 cursor-pointer">R{item.index || 0 + 1} - {item.date}</h2>
              <PiSelectionAllBold className='mr-5 hover:bg-blue-700 hover:text-white cursor-pointer' onClick={() => onSelect(item.index || 1, -1)} />
            </div>
            {!item.live && openRoundIndex !== item.index &&
              <MdOutlineExpandCircleDown className='absolute top-2 right-2 cursor-pointer text-xl text-green-700' onClick={() => toggleRound(item.index || 0)} />
            }
            {!item.live && openRoundIndex === item.index &&
              <IoChevronUpCircleOutline className='absolute top-2 right-2 cursor-pointer text-xl text-red-500' onClick={() => toggleRound(item.index || 0)} />
            }

            {item.live && <CiStreamOn className='absolute top-0 right-0 text-green-600' />}
            {((openRoundIndex === item.index && item.pairs.length > 0) || item.live) && (
              <ul>
                {item.pairs.map((pair, pairIndex) => (
                  <li key={pairIndex} className="mb-2 cursor-pointer hover:bg-slate-400 p-2 border rounded-lg">
                    <div className="flex justify-between items-center" onClick={() => onSelect(item.index || 0 + 1, pairIndex + 1)}>
                      <div className="flex flex-col w-3/4">
                        <div className="text-sm font-semibold">{pair.white}</div>
                        <div className="text-sm font-semibold">{pair.black}</div>
                      </div>
                      <div className="flex justify-center w-1/8 text-center">
                        <span className="text-sm font-bold">{pair?.result}</span>
                      </div>
                      <div className="flex justify-end w-1/8 text-center">
                        <BiSolidChess className="text-xl" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {openRoundIndex === item.index && item.pairs.length === 0 && (
              <p>No pairs scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
