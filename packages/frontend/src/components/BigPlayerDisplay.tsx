import { Pair } from "library";
import { FaChessKing, FaRegChessKing } from "react-icons/fa6";
import Clock from "./Clock";


export default function BigPlayerDisplay({ pair, time, color, reverse = false }: { pair: Pair, time: { black: number, white: number }, color: 'white' | 'black', reverse?: boolean }) {
    return (
        <div className="flex items-center justify-center text-4xl">
            <div className={"flex justify-between " + (reverse ? 'flex-col-reverse' : 'flex-col')}>
                <div className='font-bold mb-5 whitespace-nowrap'>
                    {color === 'white' ? <FaRegChessKing className='inline' /> : <FaChessKing className='inline' />}{pair[color]}
                </div>
                <div className='flex justify-around mt-2 mb-2'>
                    <Clock time={time[color]} size="text-4xl"></Clock>
                </div>
            </div>
        </div>
    )
}