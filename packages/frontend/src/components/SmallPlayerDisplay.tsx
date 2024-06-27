import { Pair } from "library";
import { FaChessKing, FaRegChessKing } from "react-icons/fa6";
import Clock from "./Clock";


export default function PlayerDisplay({ pair, time, color, icon = true }: { icon?: boolean, pair: Pair, time: { black: number, white: number }, color: 'white' | 'black' }) {
    return (
        <div className="flex justify-between flex-row">
            <div className='font-bold'>

                {color === 'white' && icon && <FaRegChessKing className='inline' />}
                {color === 'black' && icon && <FaChessKing className='inline' />}
                {pair[color].title && <span className="text-sm">({pair[color].title || ''})</span>}
                <span>{pair[color].name} </span>
                {pair[color].elo && <span className="text-sm">({pair[color].elo || ''})</span>}
            </div>
            <div className='flex justify-around'>
                <Clock time={time[color]} ></Clock>
            </div>
        </div>
    )
}