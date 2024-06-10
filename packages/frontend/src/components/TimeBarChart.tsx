import React from 'react';

interface TimeBarChartProps {
    whiteTime: number;
    blackTime: number;
    maxTime: number;
}

const TimeBarChart = ({ whiteTime, blackTime, maxTime }: TimeBarChartProps) => {
    // Calculate width percentages
    const whiteWidthPercent = (whiteTime / maxTime) * 100;
    const blackWidthPercent = (blackTime / maxTime) * 100;

    return (
        <div className="w-full max-w-lg">
            <div className="flex flex-col gap-0">
                {/* White Time Bar */}
                <div className="flex items-center justify-end h-2">
                    <div className="relative h-full w-full bg-gray-100 border border-gray-200 flex items-center">
                        <div
                            className="absolute right-0 h-full bg-white rotate-180"
                            style={{ width: `${whiteWidthPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-3xs pr-2 w-[30px] inline-block text-right">{whiteTime}s</span>
                </div>
                {/* Black Time Bar */}
                <div className="flex items-center justify-end h-2">
                    <div className="relative h-full w-full bg-gray-100 border border-gray-200 flex items-center">
                        <div
                            className="absolute right-0 h-full bg-slate-800 rotate-180"
                            style={{ width: `${blackWidthPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-3xs pr-2 text-black w-[30px] inline-block text-right">{blackTime}s</span>
                </div>
            </div>
        </div>
    );
};

export default TimeBarChart;
