import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Keyboard, {
    ICalculatorKeyboardProps,
    ICalculatorKeyboardKey as IKey
} from './Keyboard'
import Screen from './Screen'
import BigNumber from 'bignumber.js'

export interface ICalculatorProps extends React.HTMLAttributes<HTMLElement> {
    value?: string
    autofocus?: boolean
}

const SYMBOL: {
    readonly equals: IKey['Equals']
    readonly reset: IKey['Reset']
    readonly backspace: IKey['Backspace']
    readonly number: IKey['Number'][]
    readonly operator: IKey['Operator'][]
    readonly caculate: {
        [key in IKey['Operator']]: string
    }
} = {
    equals: 'equals',
    backspace: 'backspace',
    reset: 'reset',
    number: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.'],
    operator: ['plus', 'minus', 'multiplication', 'division'],
    caculate: {
        multiplication: 'multipliedBy',
        division: 'dividedBy',
        plus: 'plus',
        minus: 'minus'
    }
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
    Enter: 'equals',
    Backspace: 'backspace'
}

const Calculator: React.FC<ICalculatorProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        value: valueProp = '0',
        autofocus = false,
        ...other
    }: typeof props = props
    const className = clsx(classNameProp)

    const [queue, setQueue] = useState<string[]>([valueProp])
    useEffect(() => {}, [valueProp])

    const [focus, setFocus] = useState(autofocus)
    const [focusKeyboard, setFocusKeyboard] = useState(false)
    useEffect(() => {
        if (!focus && !focusKeyboard) {
            equals()
        }
    }, [focus, focusKeyboard])

    const bindProps = {
        className,
        ...other
    }

    const operators = SYMBOL.operator
    const operatorsLength = operators.length
    const proccesser = (arr: string[]): string => {
        for (let i = 0; i < operatorsLength; i += 1) {
            const operator = operators[i]
            const index = arr.indexOf(operator)

            if (index === -1) {
                continue
            }

            const left = arr.slice(0, index)
            const right = arr.slice(index + 1, arr.length)
            const leftLen = left.length
            const rightLen = right.length

            if (leftLen && rightLen) {
                // 相当于 left.plus(right)
                return `new BigNumber(${proccesser(left)}).${
                    SYMBOL.caculate[operator]
                }(${proccesser(right)})`
            } else if (leftLen || rightLen) {
                return proccesser(leftLen > rightLen ? left : right)
            }
        }

        return arr.length > 0
            ? `new BigNumber('${arr[0]}')`
            : `new BigNumber('0')`
    }

    const equals = () => {
        const str = proccesser(queue)
        const calculate = new Function('BigNumber', `return ${str}`)
        const result = calculate(BigNumber) as BigNumber

        setQueue([`${new BigNumber(result.toFixed(2))}`])
    }

    const addNumber = (number: IKey['Number']) => {
        const _queue = [...queue]
        const last = _queue.pop()!
        if (number === '.') {
            if (isNumberString(last)) {
                if (last.indexOf('.') === -1) {
                    _queue.push(`${last}.`)
                } else {
                    _queue.push(last)
                }
            } else {
                _queue.push(last, '0.')
            }
        } else {
            if (isNumberString(last)) {
                if (last === '0') {
                    _queue.push(`${number}`)
                } else {
                    _queue.push(`${last}${number}`)
                }
            } else {
                _queue.push(last, `${number}`)
            }
        }
        setQueue(_queue)
    }

    const addSymbol = (symbol: IKey['Operator']) => {
        const _queue = [...queue]
        const last = _queue.pop()!
        if (!SYMBOL.operator.includes(last as IKey['Operator'])) {
            _queue.push(last)
        }
        _queue.push(symbol)
        setQueue(_queue)
    }

    const backspace = () => {
        const _queue = [...queue]
        const last = _queue.pop()!
        if (isNumberString(last)) {
            if (last.length > 1) {
                const cuted = last.slice(0, last.length - 1)
                _queue.push(cuted === '-' ? '0' : cuted)
            } else {
                last === '0' ? _queue.pop() : _queue.push('0')
            }
        }
        setQueue(_queue.length > 0 ? _queue : ['0'])
    }

    const reset = () => {
        const _queue = [...queue]
        const last = _queue.pop()!
        if (isNumberString(last)) {
            if (last === '0') {
                _queue.push('0')
                setQueue(_queue)
                return
            }
        }
        setQueue(['0'])
    }

    const handler: ICalculatorKeyboardProps['handler'] = symbol => {
        switch (true) {
            case SYMBOL.number.includes(symbol as IKey['Number']):
                addNumber(symbol as IKey['Number'])
                break
            case SYMBOL.operator.includes(symbol as IKey['Operator']):
                addSymbol(symbol as IKey['Operator'])
                break
            case SYMBOL.backspace === symbol:
                backspace()
                break
            case SYMBOL.reset === symbol:
                reset()
                break
            default:
                if (queue.length === 1) {
                    setFocus(false)
                    setFocusKeyboard(false)
                } else {
                    equals()
                }
        }
    }

    const isAllClear = () => {
        const _queue = [...queue]
        const last = _queue.pop()!
        return !isNumberString(last)
    }

    const onKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
        const key = event.key
        if (key in KEYMAP) {
            handler(KEYMAP[key])
        }
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const key = event.key
        if (key === 'Escape') {
            setFocus(false)
            setFocusKeyboard(false)
        }
    }

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
                text={{
                    reset: isAllClear() || queue.length === 1 ? 'AC' : '',
                    equals: queue.length === 1 ? '完成' : ''
                }}
            ></Keyboard>
        </>
    )
}

export default Calculator

function isNumberString(number: string) {
    return !/[^0-9\.-]/.test(number)
}
