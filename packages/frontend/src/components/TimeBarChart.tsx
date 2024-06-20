import { secondsToMMSS } from 'library';
import React from 'react';

interface TimeBarChartProps {
    whiteTime: number;
    blackTime?: number;
    maxTime: number;
}

const TimeBarChart = ({ whiteTime, blackTime, maxTime }: TimeBarChartProps) => {
    // Calculate width percentages
    const whiteWidthPercent = (whiteTime / maxTime) * 100;
    const blackWidthPercent = ((blackTime || 0) / maxTime) * 100;

    return (
        <div className="w-full max-w-lg">
            <div className="flex flex-col gap-0">
                {/* White Time Bar */}
                <div className="flex items-center justify-end h-2">
                    <div className="relative h-full w-full bg-stone-300 border border-stone-200 flex items-center">
                        <div
                            className="absolute right-0 h-full bg-white rotate-180"
                            style={{ width: `${whiteWidthPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-3xs pr-2 w-[60px] inline-block text-right">{secondsToMMSS(whiteTime)}</span>
                </div>
                <div className="flex items-center justify-end h-2">
                    <div className="relative h-full w-full bg-stone-300 border border-stone-200 flex items-center">
                        <div
                            className="absolute right-0 h-full bg-slate-800 rotate-180"
                            style={{ width: `${blackWidthPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-3xs pr-2 text-black w-[60px] inline-block text-right">{secondsToMMSS(blackTime || 0)}</span>
                </div>
            </div>
        </div>
    );
};

export default TimeBarChart;
