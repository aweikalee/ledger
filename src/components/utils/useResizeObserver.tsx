import React, { useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export default function(ref: React.RefObject<any>, callback: () => void) {
    useEffect(() => {
        let ob: ResizeObserver
        const element = ref.current
        if (element) {
            ob = new ResizeObserver(callback)
            ob.observe(element)
        }

        return () => {
            if (ob) {
                ob.disconnect()
            }
        }
    }, [ref, callback])
}
