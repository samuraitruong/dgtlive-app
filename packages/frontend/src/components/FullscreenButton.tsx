import { AiOutlineFullscreenExit } from "react-icons/ai"
import { BsFullscreen } from "react-icons/bs"

export function FullscreenButton({ isFullscreen = false, toggleFullscreen }: { isFullscreen?: boolean, toggleFullscreen: () => void }) {

    return <button onClick={toggleFullscreen} className="hover:bg-blue-700 hover:rounded-full p-1 hover:text-white">

        {isFullscreen ?
            <AiOutlineFullscreenExit
                onClick={toggleFullscreen}
                className="text-red-400 cursor-pointer font-bold"
            >
            </AiOutlineFullscreenExit> :
            < BsFullscreen
                onClick={toggleFullscreen}
                className="text-slate-800 cursor-pointer hover:text-white font-bold "
            >
            </BsFullscreen >
        }

    </button >

}