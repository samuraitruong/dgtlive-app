export function mapGameResult(result: string) {
    if (!result) {
        return "*"
    }
    const resultmap: { [x: string]: string } = {
        "WHITEFORFAIT": '1-0',
        "BLACKFORFAIT": '0-1',
        "BLACKWIN": "0-1",
        "WHITEWIN": "1-0",
        "DRAW": "1/2-1/2",
        "NOTPLAYED": "-",
        "*": "*"
    }

    return resultmap[result.toUpperCase()] || result
}

export function secondsToMMSS(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
