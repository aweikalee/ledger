import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { ICalculatorKeyboardKey as IKey } from './Keyboard'
import BigNumber from 'bignumber.js'
import styles from './Screen.module.scss'

export interface IKeyboradScreenProps
    extends React.HTMLAttributes<HTMLElement> {
    queue?: string[]
    focus?: boolean
}

const SYMBOL: {
    [key in IKey['Operator']]: string
} = {
    multiplication: '×',
    division: '÷',
    plus: '+',
    minus: '-'
}

const Screen: React.FC<IKeyboradScreenProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        queue = ['0'],
        focus,
        ...other
    }: typeof props = props

    const className = clsx(styles.screen, classNameProp)

    const el = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (el && el.current) {
            el.current.scrollTo({
                top: 999999999999
            })
        }
    }, [el, queue])

    const bindProps = {
        className,
        ref: el,
        'data-focus': focus,
        ...other
    }

    return (
        <div data-role="calculator-screen" {...bindProps}>
            {(() => {
                if (focus) {
                    return queue.length === 1
                        ? getScreenNumber(queue[0])
                        : getScreenFormula(queue)
                } else {
                    return getScreenAbbreviation(queue[0])
                }
            })()}
        </div>
    )
}

export default Screen

function getScreenNumber(number: string) {
    return new BigNumber(number).toFormat(2)
}

function getScreenFormula(arr: string[]) {
    return arr.map((part, index) => {
        const key = `${index},${part}`
        return part in SYMBOL ? (
            <React.Fragment key={key}>
                <wbr />
                <span data-role={part} className={styles.operator}>
                    {SYMBOL[part as IKey['Operator']]}
                </span>
            </React.Fragment>
        ) : (
            <span data-role="number" key={key}>
                {new BigNumber(part).toFormat()}
            </span>
        )
    })
}

function getScreenAbbreviation(number: string) {
    const bignumber = new BigNumber(number)
    const result =
        number.length > 24 ? bignumber.toExponential(18) : bignumber.toFixed(2)
    return <span>{result}</span>
}
