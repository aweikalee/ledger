import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Button } from '../Button'
import Loading from './Loading'
import styles from './LoadMore.module.scss'
import { throttle } from '@/utils/throttle'

type IStatus = 'ready' | 'loading' | 'complete' | 'error'

export interface ILoadMoreProps extends React.HTMLAttributes<HTMLElement> {
    handler(callback: (error: Error | null, complete?: boolean) => void): void
}

const LoadMore: React.FC<ILoadMoreProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        handler,
        ...other
    }: typeof props = props

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

    const className = clsx(styles['load-more'], classNameProp)
    const bindProps = {
        className,
        ref: el,
        ...other
    }

    const children: {
        [key in IStatus]: JSX.Element
    } = {
        ready: <div data-role="loading-text">加载更多</div>,
        loading: <Loading block />,
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
        <div data-role="load-more" {...bindProps}>
            {children[status]}
        </div>
    )
}

export default LoadMore
