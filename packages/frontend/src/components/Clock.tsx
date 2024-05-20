import { GiAlarmClock } from "react-icons/gi";

interface ClockProps {
    time: number
}

function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

const Clock = ({time}: ClockProps) => {
    return <div className="flex">
        <GiAlarmClock className="mr-1 pt-1"/>
        <span className="text-bold">{formatTime(time)}</span>
    </div>
}

export default Clock;