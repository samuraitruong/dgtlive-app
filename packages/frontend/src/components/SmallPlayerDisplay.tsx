import { Pair } from "library";
import { FaChessKing, FaRegChessKing } from "react-icons/fa6";
import Clock from "./Clock";



export default function PlayerDisplay({ pair, time, color }: { pair: Pair, time: { black: number, white: number }, color: 'white' | 'black' }) {
    return (
        <div className="flex justify-between flex-row">
            <div className='font-bold'>
                {color === 'white' ? <FaRegChessKing className='inline' /> : <FaChessKing className='inline' />}
                <span>{pair[color]}</span>
            </div>
            <div className='flex justify-around'>
                <Clock time={time[color]} ></Clock>
            </div>
        </div>
    )
}