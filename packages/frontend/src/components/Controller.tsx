import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";
import { TbPlayerTrackNext } from "react-icons/tb";
import { TbPlayerTrackPrev } from "react-icons/tb";
import { LuMaximize } from "react-icons/lu";
import { useEffect, useRef } from "react";
interface ControlerProps {
    handleMaxSize : () => void;
    handlePrevMove: () => void,
    handleNextMove: () => void;
    currentIndex: number;
    total: number;
}
export default function Controler({handlePrevMove, handleNextMove, currentIndex, total, handleMaxSize}: ControlerProps) {
   
    return (
        <div className={"flex w-full justify-between mt-3"}>
            <button ><TbPlayerTrackPrev /></button>
        <button onClick={handlePrevMove} disabled={currentIndex === 0}><GrCaretPrevious/></button>
        <button onClick={handleNextMove} disabled={currentIndex === total - 1}><GrCaretNext /></button>
        <button ><TbPlayerTrackNext /></button>
        <button onClick={handleMaxSize}><LuMaximize/></button>
      </div>
    )
}