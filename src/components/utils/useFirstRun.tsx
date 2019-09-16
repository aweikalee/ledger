import { useRef, useEffect } from 'react'

export const useFirstRun = () => {
    const ref = useRef(true)
    useEffect(() => {
        ref.current = false
    }, [])
    return ref
}

export default useFirstRun
