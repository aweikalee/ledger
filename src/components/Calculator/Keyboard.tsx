import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import styles from './Keyboard.module.scss'
import stylesButton from '../Button/Button.module.scss'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'

export interface ICalculatorKeyboardKey {
    Number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | '.'
    Equals: 'equals'
    Backspace: 'backspace'
    Reset: 'reset'
    Operator: 'plus' | 'minus' | 'multiplication' | 'division'
    All:
        | ICalculatorKeyboardKey['Equals']
        | ICalculatorKeyboardKey['Number']
        | ICalculatorKeyboardKey['Operator']
        | ICalculatorKeyboardKey['Backspace']
        | ICalculatorKeyboardKey['Reset']
}

const SYMBOL: {
    [key: string]: string | JSX.Element
} = {
    equals: '=',
    backspace: '<=',
    reset: 'C',
    plus: '+',
    minus: '-',
    multiplication: '×',
    division: '÷',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    0: '0',
    '.': '.'
}

export interface ICalculatorKeyboardProps
    extends React.HTMLAttributes<HTMLElement> {
    show?: boolean
    focus?: boolean
    handler?: (symbol: ICalculatorKeyboardKey['All']) => void
    text?: {
        [key in ICalculatorKeyboardKey['All']]?: string
    }
}

const Keyboard: React.FC<ICalculatorKeyboardProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        show,
        focus,
        handler,
        text = {},
        ...other
    }: typeof props = props
    const className = clsx(styles.keyboard, classNameProp)
    const classNameButton = clsx(
        stylesButton.button,
        stylesButton.contained,
        stylesButton.default,
        styles.button
    )
    const classnames: CSSTransitionClassNames = {
        appear: styles['appear'],
        appearActive: styles['appear-active'],
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }

    const el = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (el && el.current) {
            if (focus) {
                el.current.focus()
            } else {
                el.current.blur()
            }
        }
    }, [el, focus])

    const bindProps = {
        className,
        ref: el,
        ...other
    }

    const keyMap: ICalculatorKeyboardKey['All'][] = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        '.',
        'plus',
        'minus',
        'multiplication',
        'division',
        'equals',
        'reset',
        'backspace'
    ]

    return (
        <CSSTransition
            in={show}
            unmountOnExit
            timeout={400}
            classNames={classnames}
            appear
        >
            <div data-role="number-keyboard" {...bindProps}>
                {keyMap.map(symbol => (
                    <div
                        data-role={`${symbol}`}
                        key={symbol}
                        onClick={() => {
                            handler && handler(symbol)
                        }}
                        className={classNameButton}
                    >
                        {text[symbol] ? text[symbol] : SYMBOL[symbol]}
                    </div>
                ))}
            </div>
        </CSSTransition>
    )
}

export default Keyboard
