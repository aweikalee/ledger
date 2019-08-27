const timers: NodeJS.Timeout[] = []
const methods: Function[] = []

export const throttle = (method: Function, interval = 100) => {
    if (methods.indexOf(method) === -1) {
        methods.push(method)

        timers.push(
            setTimeout(() => {
                method()

                methods.splice(methods.indexOf(method))
                timers.shift()
            }, interval)
        )
    }
}
