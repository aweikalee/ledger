import React, { useRef, useEffect } from 'react'
import { Button } from '../Button'
import Loading, { ILoadingProps } from './Loading'
import { useThrottleDelay } from '@/utils/throttle'

export interface ILoadMoreProps extends ILoadingProps {
    loading?: boolean
    complete?: boolean
    error?: boolean
    handler?: Function
}

const LoadMore: React.FC<ILoadMoreProps> = props => {
    const {
        children: childrenProp,
        loading,
        complete,
        error,
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

    const loadingRef = useRef<typeof loading>(loading)
    useEffect(() => {
        loadingRef.current = loading
    }, [loading])

    const completeRef = useRef<typeof complete>(complete)
    useEffect(() => {
        completeRef.current = complete
    }, [complete])

    const errorRef = useRef<typeof error>(error)
    useEffect(() => {
        errorRef.current = error
    }, [error])

    const handlerRef = useRef<typeof handler>(handler)
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    /*
        初始化 加载一次，如果未填满屏幕则再重复加载
        之后按滚动事件进行判定
    */

    const checkStatus = () => {
        return loadingRef.current === false && completeRef.current === false
    }

    const checkSrcoll = () => {
        return (
            errorRef.current === false &&
            el.current &&
            el.current.getBoundingClientRect().top < screenRef.current.h
        )
    }

    const onScroll = useThrottleDelay(() => {
        if (checkStatus() && checkSrcoll() && handlerRef.current) {
            handlerRef.current()
        }
    }, 200)

    const onClick = () => {
        if (checkStatus() && handlerRef.current) {
            handlerRef.current()
        }
    }

    useEffect(() => {
        onScroll()
    }, [loading, complete, onScroll])

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

    const children = {
        ready: (
            <div data-role="loading-text">
                <Button
                    type="text"
                    color="primary"
                    size="medium"
                    border="round"
                    onClick={onClick}
                >
                    点击加载更多
                </Button>
            </div>
        ),
        complete: <div data-role="loading-text">没有更多了</div>,
        error: (
            <>
                <Button
                    type="outlined"
                    color="primary"
                    size="medium"
                    border="round"
                    onClick={onClick}
                >
                    点击重新加载
                </Button>
                <div data-role="loading-text">加载失败</div>
            </>
        )
    }

    return (
        <Loading data-role="load-more" {...bindProps}>
            {!loading && complete
                ? children.complete
                : error
                ? children.error
                : children.ready}
        </Loading>
    )
}

export default LoadMore
