import React, { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import Keyboard, {
    ICalculatorKeyboardProps,
    ICalculatorKeyboardKey as IKey
} from './Keyboard'
import Screen from './Screen'
import { useQueue } from './queue'

export interface ICalculatorProps extends React.HTMLAttributes<HTMLElement> {
    value?: string
    autofocus?: boolean
    onUpdate?: (result: string) => void
}

const SYMBOL: {
    readonly equals: IKey['Equals']
    readonly reset: IKey['Reset']
    readonly backspace: IKey['Backspace']
    readonly number: IKey['Number'][]
    readonly operator: IKey['Operator'][]
} = {
    equals: 'equals',
    backspace: 'backspace',
    reset: 'reset',
    number: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'],
    operator: ['plus', 'minus', 'multiplication', 'division']
}

const KEYMAP: {
    [key: string]: IKey['All']
} = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 0,
    '.': '.',
    '+': 'plus',
    '-': 'minus',
    '*': 'multiplication',
    '/': 'division',
    '=': 'equals',
    Enter: 'equals'
}

const Calculator: React.FC<ICalculatorProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        value: valueProp = '0',
        autofocus = false,
        onUpdate,
        ...other
    }: typeof props = props
    const className = clsx(classNameProp)

    const bindProps = {
        className,
        ...other
    }

    const [queue, queueRef, setQueue] = useQueue(valueProp)

    const [focus, setFocus] = useState(autofocus)
    const [focusKeyboard, setFocusKeyboard] = useState(false)
    const lastFocus = useRef([focus, focusKeyboard])
    useEffect(() => {
        const last = lastFocus.current
        if (last[0] !== focus || last[1] !== focusKeyboard) {
            if (!focus && !focusKeyboard) {
                setQueue.equals(onUpdate)
            }
            lastFocus.current = [focus, focusKeyboard]
        }
    }, [focus, focusKeyboard, setQueue, onUpdate])

    const handler: ICalculatorKeyboardProps['handler'] = useCallback(
        symbol => {
            switch (true) {
                case SYMBOL.number.includes(symbol as IKey['Number']):
                    setQueue.addNumber(symbol as IKey['Number'])
                    break
                case SYMBOL.operator.includes(symbol as IKey['Operator']):
                    setQueue.addOperator(symbol as IKey['Operator'])
                    break
                case SYMBOL.backspace === symbol:
                    setQueue.backspace()
                    break
                case SYMBOL.reset === symbol:
                    setQueue.clear()
                    break
                default:
                    setQueue.equals(onUpdate)
                    if (queueRef.current.length === 1) {
                        setFocus(false)
                        setFocusKeyboard(false)
                    }
            }
        },
        [setQueue, queueRef, setFocus, setFocusKeyboard, onUpdate]
    )

    /* 绑定热键 */
    const nowKey = useRef('')

    const onKeyPress = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            const key = event.key

            if (key in KEYMAP) {
                handler(KEYMAP[key])
            }
        },
        [handler]
    )

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            const key = event.key
            if (key === 'Escape') {
                setFocus(false)
                setFocusKeyboard(false)
            } else if (key === 'Backspace' || key === 'Delete') {
                handler('backspace')
                nowKey.current = 'Backspace'
            }
        },
        [handler, setFocus, setFocusKeyboard]
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

    return (
        <>
            <Screen
                tabIndex={1}
                show={focusKeyboard || focus}
                focus={focus}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 1)}
                onKeyPress={onKeyPress}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                queue={queue}
                {...bindProps}
            />
            <Keyboard
                tabIndex={2}
                show={focusKeyboard || focus}
                focus={focusKeyboard}
                onFocus={() => setFocusKeyboard(true)}
                onBlur={() => setTimeout(() => setFocusKeyboard(false), 1)}
                handler={handler}
                onKeyPress={onKeyPress}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                text={{
                    reset:
                        setQueue.isAllClear() || queue.length === 1 ? 'AC' : '',
                    equals: queue.length === 1 ? '完成' : ''
                }}
            ></Keyboard>
        </>
    )
}

export default Calculator
