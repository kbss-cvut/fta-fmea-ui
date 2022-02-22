export const yupOptionalNumber = (cv, ov) => {
    return ov === '' ? undefined : cv;
}

export const checkArray = (value) => {
    if (!Array.isArray(value)) {
        value = [value]
    }
    return value
}