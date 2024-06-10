export function mapGameResult(result: string) {
    const resultmap: any = {
        "BLACKWIN": "0-1",
        "WHITEWIN": "1-0",
        "DRAW": "1/2-1/2",
        "*": "*"
    }

    return resultmap[result.toUpperCase()] || result
}
