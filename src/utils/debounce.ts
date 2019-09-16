const timers: NodeJS.Timeout[] = []
const methods: Function[] = []

export const debounce = (method: Function, interval = 100) => {
    const index = methods.indexOf(method)
    if (index !== -1) {
        clearTimeout(timers[index])
        methods.splice(index)
        timers.splice(index)
    }

    methods.push(method)
    timers.push(
        setTimeout(() => {
            method()
            const index = methods.indexOf(method)
            methods.splice(index)
            timers.splice(index)
        }, interval)
    )
}
