import { useState, useRef, useLayoutEffect } from 'react'

export default () => {
    const [modalQueue, setModalQueue] = useState<number[]>([])

    const modalQueueRef = useRef(modalQueue)
    useLayoutEffect(() => {
        modalQueueRef.current = modalQueue
    }, [modalQueue])

    return { modalQueue, setModalQueue, modalQueueRef }
}
