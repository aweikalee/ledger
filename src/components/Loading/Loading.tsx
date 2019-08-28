import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'
import styles from './Loading.module.scss'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'

export interface ILoadingProps extends React.HTMLAttributes<HTMLElement> {
    show?: boolean
    fill?: boolean
    delay?: number
    message?: string
}

const Loading: React.FC<ILoadingProps> = (props, ref) => {
    const {
        className: classNameProp,
        children,
        show = true,
        fill,
        delay: delayProp = 0,
        message: messageProp,
        ...other
    }: typeof props = props
    const className = clsx(
        styles.loading,
        {
            [styles.fill]: fill
        },
        classNameProp
    )

    const classnames: CSSTransitionClassNames = {
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }
    const bindProps = {
        ref,
        className,
        ...other
    }
    const message = messageProp || '加载中'

    const [delay, setDelay] = useState(delayProp)
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (delay) {
            timer = setTimeout(() => {
                setDelay(0)
            }, delay)
        }

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [delay, delayProp])

    return (
        <CSSTransition
            in={!delay && show}
            unmountOnExit
            timeout={400}
            classNames={classnames}
        >
            <div data-role="loading" {...bindProps}>
                {children || (
                    <>
                        <Spinner />
                        <div data-role="loading-text">{message}</div>
                    </>
                )}
            </div>
        </CSSTransition>
    )
}

export default Loading
