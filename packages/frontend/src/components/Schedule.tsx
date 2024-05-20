import { Round } from 'library/src/model/tournament';
import { BiSolidChess } from "react-icons/bi";
import React from 'react';
interface ScheduleProps {
    data: Round[]
    onSelect: (round: number, gameId: number)=> void
}
const Schedule = ({ data , onSelect}: ScheduleProps) => {
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-100 p-1">
            <h2 className="text-xl font-bold mb-2">R{index+1} - {item.date}</h2>
            {item.pairs.length > 0 ? (
              <ul>
                {item.pairs.map((pair, pairIndex) => (
                  <li key={pairIndex} className="mb-2 cursor-pointer">
                    <div className="flex justify-between items-center" onClick={() => onSelect(index+1, pairIndex+1)}>
                      <div>
                         {pair.black} {' '}
                        vs
                        {' '}
                         {pair.white} - {pair.result}
                      </div>
                      <div>
                        <BiSolidChess/>
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
