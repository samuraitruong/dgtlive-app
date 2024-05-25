import { Pair } from "library";
import { FaChessKing, FaRegChessKing } from "react-icons/fa6";
import Clock from "./Clock";


export default function BigPlayerDisplay({ pair, time, color }: { pair: Pair, time: { black: number, white: number }, color: 'white' | 'black' }) {
    return (
        <div className="flex items-center justify-center text-4xl">
            <div className="flex justify-between flex-col">
                <div className='font-bold mb-5 whitespace-nowrap'>
                    {color === 'white' ? <FaChessKing className='inline' /> : <FaRegChessKing className='inline' />}{pair[color]}
                </div>
                <div className='flex justify-around'>
                    <Clock time={time[color]} ></Clock>
                </div>
            </div>
        </div>
    )
}