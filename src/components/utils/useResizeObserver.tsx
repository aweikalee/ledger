import React, { useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { getContentRect } from 'resize-observer-polyfill/src/utils/geometry'

export const useResizeObserver = (
    ref: React.RefObject<any>,
    callback: () => void
) => {
    useEffect(() => {
        const element = ref.current
        let ob: ResizeObserver
        if (element) {
            let { width, height } = getContentRect(element)
            ob = new ResizeObserver(entries => {
                const entry = entries[0]
                const rect = entry.contentRect
                /* 不同浏览器存在精度问题 */
                if (
                    Math.round(width) !== Math.round(rect.width) ||
                    Math.round(height) !== Math.round(rect.height)
                ) {
                    callback()
                }
                width = rect.width
                height = rect.height
            })
            ob.observe(element)
        }

        return () => {
            if (ob) {
                ob.disconnect()
            }
        }
    }, [ref, callback])
}

export default useResizeObserver
