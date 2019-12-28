export const localTimeOffset = new Date().getTimezoneOffset()

const timeZone: {
    [key: number]: string
} = {}
export const offsetToUTC = (offset: number) => {
    if (timeZone[offset]) {
        return timeZone[offset]
    }

    const abs = Math.abs(offset)
    const minute = Math.round(abs % 60)
    const hour = Math.round((abs - minute) / 60)

    let text = ''
    if (hour || minute) {
        text += offset < 0 ? '+' : '-'
        text += hour
        if (minute) {
            text += `:${minute < 10 ? `0${minute}` : minute}`
        }
    }

    timeZone[offset] = `UTC${text}`
    return timeZone[offset]
}

export const timeTransform = {
    toUTC(time: number) {
        return time + localTimeOffset * 60 * 1000
    },
    toLocal(time: number) {
        return time - localTimeOffset * 60 * 1000
    }
}
export const UTC = () => {}