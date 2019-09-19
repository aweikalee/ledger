import { useRef, useEffect } from 'react'

export const useDebounce = (
    method: (...args: any[]) => void,
    interval = 100
) => {
    const timer = useRef<NodeJS.Timeout>()
    useEffect(
        () => () => {
            if (timer.current) {
                clearTimeout(timer.current)
            }
        },
        []
    )

    return (...args: any[]) => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            method(...args)
        }, interval)
        return timer.current
    }
}
