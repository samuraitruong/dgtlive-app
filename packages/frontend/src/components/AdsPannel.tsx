import { Ads } from "library";
import React, { useState, useEffect } from "react";



interface AdsPanelProps {
    ads: Ads[];
    location: "top" | "right" | "bottom" | "left";
    showFrequency: number; // Time in milliseconds before the panel shows again after being closed
}

const AdsPanel: React.FC<AdsPanelProps> = ({ ads, location, showFrequency }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300); // Duration matches the transition duration
    };

    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => setIsVisible(true), showFrequency);
            return () => clearTimeout(timer);
        }
    }, [isVisible, showFrequency]);

    const locationClasses = {
        top: "top-0 left-1/2 transform -translate-x-1/2",
        right: "top-1/2 right-0 transform -translate-y-1/2",
        bottom: "bottom-0 left-1/2 transform -translate-x-1/2",
        left: "top-1/2 left-0 transform -translate-y-1/2",
    };

    if ((!isVisible && !isClosing) || !ads || ads.length === 0) return null;

    return (
        <div
            className={` fixed ${locationClasses[location]} bg-white shadow-lg p-2 rounded-lg flex flex-col space-y-4
        transition-transform duration-300 ease-in-out ${isClosing ? "transform scale-90 opacity-0" : "transform scale-100 opacity-100"
                }`}
        >
            <button
                className="absolute top-[-10px] right-0 ml-auto bg-red-500 text-white rounded-full p-1 w-[35px]"
                onClick={handleClose}
            >
                ✕
            </button>
            {ads.map((ad, index) => (
                <a
                    key={index}
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                >
                    <img crossOrigin='anonymous' src={ad.image} alt={ad.name} width={100} className="w-[130px] rounded-md" />
                </a>
            ))}
        </div>
    );
};

export default AdsPanel;
