import { useCallback, useEffect, useState } from 'react';

const useKeyPress = (targetKey: string, callback: () => void) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = useCallback(({ key }: any) => {
        if (key === targetKey) {
            setKeyPressed(true);
            callback()
        }
    }, [setKeyPressed, callback, targetKey]);

    // const upHandler = ({ key }: any) => {
    //     if (key === targetKey) {
    //         setKeyPressed(false);
    //     }
    // };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        //window.addEventListener('keyup', upHandler);

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', downHandler);
            // window.removeEventListener('keyup', upHandler);
        };
    }, [targetKey, callback, downHandler]); // Re-run effect if targetKey changes

    return keyPressed;
};

export default useKeyPress;
