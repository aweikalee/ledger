export const debounce = (method: Function, interval = 100) => {
    throw Error(`Please use "debounceFactory" instead of "debounce"`)
}

export const debounceFactory = (method: Function, interval = 100) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => method(...args), interval)
    }
}
