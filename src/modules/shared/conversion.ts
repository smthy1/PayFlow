
function convertToCents(value: number) {
    return Math.round(value * 100)
}

function convertCentsToBRL(value: bigint) {
    const reais = Number(value) / 100;
    return reais.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export { convertToCents, convertCentsToBRL };