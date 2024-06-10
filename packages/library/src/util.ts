export function mapGameResult(result: string) {
    if (!result) {
        return "*"
    }
    const resultmap: { [x: string]: string } = {
        "BLACKWIN": "0-1",
        "WHITEWIN": "1-0",
        "DRAW": "1/2-1/2",
        "NOTPLAYED": "-",
        "*": "*"
    }

    return resultmap[result.toUpperCase()] || result
}
