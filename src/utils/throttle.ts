import { useRef, useEffect } from 'react'

export const throttle = (
    method: (...args: any[]) => void,
    interval = 100
) => {
    let time = 0

    return (...args: any[]) => {
        const now = Date.now()
        if (now - time > interval) {
            method(...args)
            time = now
        }
    }
}

export const useThrottleDelay = (
    method: (...args: any[]) => void,
    interval = 100
) => {
    const timer = useRef<NodeJS.Timeout | null>(null)
    useEffect(
        () => () => {
            if (timer.current) {
                clearTimeout(timer.current)
            }
        },
        []
    )

    return (...args: any[]) => {
        if (!timer.current) {
            timer.current = setTimeout(() => {
                method(...args)
                timer.current = null
            }, interval)
        }
    }
}
