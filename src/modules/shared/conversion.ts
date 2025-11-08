
function convertToCents(value: number) {
    return Math.round(value * 100)
}

function convertCentsToBRL(value: number) {
    return value / 100;
}

export { convertToCents, convertCentsToBRL };