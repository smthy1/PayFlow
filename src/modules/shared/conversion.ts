
function convertToCents(value: number): bigint {
    return BigInt(Math.round(value * 100))
}

function convertCentsToBRL(value: bigint): number {
    return Number(value) / 100;   
}

export { convertToCents, convertCentsToBRL };