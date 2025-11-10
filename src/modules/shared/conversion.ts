
function convertToCents(value: number) {
    return Math.round(value * 100)
}

function convertCentsToBRL(value: bigint) {
    return Number(value) / 100;
}

export { convertToCents, convertCentsToBRL };