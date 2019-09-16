import React, { useRef, useEffect, useState } from 'react'
import { Button } from '../Button'
import Loading, { ILoadingProps } from './Loading'
import { useThrottleDelay } from '@/utils/throttle'

type IStatus = 'ready' | 'loading' | 'complete' | 'error'

export interface ILoadMoreProps extends ILoadingProps {
    loading?: boolean
    handler?: (
        callback: (error: Error | null, complete?: boolean) => void
    ) => void
}

const LoadMore: React.FC<ILoadMoreProps> = props => {
    const {
        children: childrenProp,
        loading = false,
        handler,
        ...other
    }: typeof props = props

    /* 缓存屏幕宽高  */
    const screenRef = useRef<{
        w: number
        h: number
    }>({
        w: window.innerWidth,
        h: window.innerHeight
    })

    useEffect(() => {
        const getScreen = () => {
            screenRef.current = {
                w: window.innerWidth,
                h: window.innerHeight
            }
        }
        window.addEventListener('resize', getScreen)
        return () => {
            window.removeEventListener('resize', getScreen)
        }
    }, [])

    /* 主程序 */
    const el = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<IStatus>('ready')

    const statusRef = useRef<typeof status>(status)
    useEffect(() => {
        statusRef.current = status
    }, [status])

    const handlerRef = useRef<typeof handler>(handler)
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    /*
        初始化 加载一次，如果未填满屏幕则再重复加载
        之后按滚动事件进行判定
    */

    const checkLoad = () => {
        if (
            status === 'loading' ||
            status === 'complete' ||
            !el.current ||
            el.current!.getBoundingClientRect().top >= screenRef.current.h
        ) {
            return false
        }
        return true
    }

    const handlerLoad = () => {
        setStatus('loading')
        try {
            if (handler) {
                handler((error, complete) => {
                    if (error) {
                        throw error
                    } else {
                        complete ? setStatus('complete') : setStatus('ready')
                    }
                })
            }
        } catch (error) {
            setStatus('error')
        }
    }

    const onScroll = useThrottleDelay(() => {
        if (checkLoad()) {
            handlerLoad()
        }
    }, 200)

    useEffect(() => {
        if (!loading) {
            onScroll()
        }
    }, [loading, onScroll])

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [onScroll])

    const bindProps = {
        ref: el,
        ...other
    }

    const children: {
        [key in IStatus]?: JSX.Element
    } = {
        ready: <div data-role="loading-text">加载更多</div>,
        complete: <div data-role="loading-text">没有更多了</div>,
        error: (
            <>
                <Button
                    type="outlined"
                    color="primary"
                    size="medium"
                    border="round"
                    onClick={() => setStatus('ready')}
                >
                    点击重新加载
                </Button>
                <div data-role="loading-text">加载失败</div>
            </>
        )
    }

    return (
        <Loading data-role="load-more" {...bindProps}>
            {status in children && children[status]}
        </Loading>
    )
}

export default LoadMore
