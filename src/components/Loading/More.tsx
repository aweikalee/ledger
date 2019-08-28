import React, { useRef, useEffect, useState } from 'react'
import { Button } from '../Button'
import LoadingOrigin, { ILoadingProps } from './Loading'
import { throttle } from '@/utils/throttle'

const Loading = React.forwardRef(LoadingOrigin)

type IStatus = 'ready' | 'loading' | 'complete' | 'error'

export interface ILoadMoreProps extends ILoadingProps {
    handler(callback: (error: Error | null, complete?: boolean) => void): void
}

const LoadMore: React.FC<ILoadMoreProps> = props => {
    const { children: childrenProp, handler, ...other }: typeof props = props

    /* 缓存屏幕宽高  */
    const [screen, setScreen] = useState<{
        w: number
        h: number
    }>(() => ({
        w: window.innerWidth,
        h: window.innerHeight
    }))

    useEffect(() => {
        const getScreen = () => {
            setScreen({
                w: window.innerWidth,
                h: window.innerHeight
            })
        }
        window.addEventListener('resize', getScreen)
        return () => {
            window.removeEventListener('resize', getScreen)
        }
    }, [])

    /* 主程序 */
    const el = useRef<HTMLDivElement>(null)
    const [status, setStatus] = useState<IStatus>('ready')

    useEffect(() => {
        const attemptLoad = () => {
            throttle(() => {
                // 检查状态及视口
                if (
                    status === 'loading' ||
                    status === 'complete' ||
                    !el.current ||
                    el.current!.getBoundingClientRect().top >= screen.h
                ) {
                    return
                }

                // 执行加载
                setStatus('loading')
                try {
                    handler((error, complete) => {
                        if (error) {
                            throw error
                        } else {
                            complete
                                ? setStatus('complete')
                                : setStatus('ready')
                        }
                    })
                } catch (error) {
                    setStatus('error')
                }
            }, 200)
        }
        attemptLoad()

        window.addEventListener('scroll', attemptLoad)
        return () => {
            window.removeEventListener('scroll', attemptLoad)
        }
    }, [status, handler, screen, el])

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
