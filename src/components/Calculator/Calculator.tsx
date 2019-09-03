import React, { useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import Keyboard, { ICalculatorKeyboardProps } from './Keyboard'
import Screen from './Screen'
import { useQueue } from './queue'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import styles from './Calculator.module.scss'
import { SYMBOL, SYMBOL_NUMBER, SYMBOL_OPERATOR } from './config'

export interface ICalculatorProps extends React.HTMLAttributes<HTMLElement> {
    value?: string
    show?: boolean
    onUpdate?: (result: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

const Calculator: React.FC<ICalculatorProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        value: valueProp = '0',
        show = false,
        onUpdate = () => {},
        onFocus = () => {},
        onBlur: onBlurProp = () => {},
        ...other
    }: typeof props = props

    const [queue, queueRef, setQueue] = useQueue(valueProp)

    const handler: ICalculatorKeyboardProps['handler'] = useCallback(
        symbol => {
            switch (true) {
                case symbol in SYMBOL_NUMBER:
                    setQueue.addNumber(symbol)
                    break
                case symbol in SYMBOL_OPERATOR:
                    setQueue.addOperator(symbol)
                    break
                case symbol === 'backspace':
                    setQueue.backspace()
                    break
                case symbol === 'reset':
                    setQueue.clear()
                    break
                default:
                    setQueue.equals(onUpdate)
                    if (queueRef.current.length === 1) {
                        onBlurProp()
                    }
            }
        },
        [setQueue, queueRef, onUpdate, onBlurProp]
    )

    /* 绑定热键 */
    const nowKey = useRef('')

    const onBlur = useCallback(() => {
        setQueue.equals(onUpdate)
        onBlurProp()
    }, [setQueue, onBlurProp, onUpdate])

    const onKeyPress = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            const key = event.key

            if (key in SYMBOL) {
                handler(key as (keyof typeof SYMBOL))
            } else if (key === 'Enter') {
                handler('=')
            }
        },
        [handler]
    )

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            const key = event.key
            if (key === 'Escape') {
                onBlur()
            } else if (key === 'Backspace' || key === 'Delete') {
                handler('backspace')
                nowKey.current = 'Backspace'
            }
        },
        [handler, onBlur]
    )

    const onKeyUp = useCallback(() => {
        nowKey.current = ''
    }, [nowKey])

    useEffect(() => {
        /* backspace 无法使用 keypress 监听, 此处将模拟连续触发 backspace */
        if (nowKey.current === 'Backspace') {
            const timer = setTimeout(() => {
                if (nowKey.current === 'Backspace') {
                    handler('backspace')
                }
            }, 200)

            return () => {
                clearTimeout(timer)
            }
        }
    })

    const el = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (show && el.current) {
            el.current.focus()
        }
    }, [el, show])

    const className = clsx(styles.calculator, classNameProp)
    const classnames: CSSTransitionClassNames = {
        appear: styles['appear'],
        appearActive: styles['appear-active'],
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }
    const bindProps = {
        className,
        ref: el,
        tabIndex: 1,
        onKeyPress,
        onKeyDown,
        onKeyUp,
        onFocus,
        onBlur,
        ...other
    }

    return (
        <CSSTransition
            in={show}
            unmountOnExit
            timeout={400}
            classNames={classnames}
            appear
        >
            <div data-role="calculator" {...bindProps}>
                <Screen queue={queue} />
                <Keyboard
                    handler={handler}
                    text={{
                        reset:
                            setQueue.isAllClear() || queue.length === 1
                                ? 'AC'
                                : '',
                        '=': queue.length === 1 ? '完成' : ''
                    }}
                ></Keyboard>
            </div>
        </CSSTransition>
    )
}

export default Calculator
