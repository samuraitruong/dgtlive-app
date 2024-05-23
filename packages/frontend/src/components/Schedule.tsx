import { Round } from 'library/src/model/tournament';
import { BiSolidChess } from "react-icons/bi";
import { CiStreamOn } from "react-icons/ci";
import React, { useMemo } from 'react';
interface ScheduleProps {
  data: Round[]
  onSelect: (round: number, gameId: number) => void
}
const Schedule = ({ data, onSelect }: ScheduleProps) => {

  const sortedData = useMemo<Round[]>(() => {
    const x = [...data].reverse().map((x, index) => ({
      ...x, index: data.length - index
    }))

    return x;
  }, [data])
  return (
    <div className="max-h-screen overflow-y-auto pb-16">
      <h1 className="text-2xl font-bold mb-4 pl-2">Schedules</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {sortedData.map((item, index) => (
          <div key={index} className={"bg-gray-100 p-2 relative" + (item.live ? ' border border-green-500 bg-green-200' : '')}>
            <h2 className="text-xl font-bold mb-2">R{item.index || 0 + 1} - {item.date}</h2>
            {item.live && <CiStreamOn className='absolute top-0 right-0 text-green-600' />}
            {item.pairs.length > 0 ? (
              <ul>
                {item.pairs.map((pair, pairIndex) => (
                  <li key={pairIndex} className="mb-2 cursor-pointer hover:bg-slate-400">
                    <div className="flex justify-between items-center" onClick={() => onSelect(index + 1, pairIndex + 1)}>
                      <div>
                        {pair.black} {' '}
                        vs
                        {' '}
                        {pair.white} - {pair.result}
                      </div>
                      <div>
                        <BiSolidChess />
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            ) : (
              <p>No pairs scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
