import React from 'react'
import clsx from 'clsx'
import styles from './Keyboard.module.scss'
import stylesButton from '../Button/Button.module.scss'
import { SYMBOL } from './config'

export interface ICalculatorKeyboardProps
    extends React.HTMLAttributes<HTMLElement> {
    handler?: (symbol: keyof typeof SYMBOL) => void
    text?: {
        [key in keyof typeof SYMBOL]?: string
    }
}

const Keyboard: React.FC<ICalculatorKeyboardProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        handler,
        text = {},
        ...other
    }: typeof props = props

    const classNameButton = clsx(
        stylesButton.button,
        stylesButton.contained,
        stylesButton.default,
        styles.button
    )

    const className = clsx(styles.keyboard, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <div data-role="calculator-keyboard" {...bindProps}>
            {(Object.keys(SYMBOL) as (keyof typeof SYMBOL)[]).map(symbol => (
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
    )
}

export default Keyboard
