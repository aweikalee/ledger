import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { ICalculatorKeyboardKey as IKey } from './Keyboard'
import BigNumber from 'bignumber.js'
import styles from './Screen.module.scss'
import styleVars from '@/style/index.module.scss'
import measure from '../utils/measure'

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

    const bindProps = {
        className,
        'data-focus': focus,
        ...other
    }

    const [screenMini, setScreenMini] = useState<string>('0.00')
    useEffect(() => {
        const number = queue[0]
        const bignumber = new BigNumber(number)
        let result
        if (number.length > 24) {
            result = bignumber
                .toExponential(18)
                .replace(/^(\d+\.\d{2,}?)0+(e\+\d+)$/, '$1$2')
        } else {
            result = bignumber.toFixed(2)
        }

        setScreenMini(result)
    }, [queue])

    const elMini = useRef<HTMLDivElement>(null)
    const [textScale, setTextScale] = useState(1)
    useEffect(() => {
        if (!focus) {
            setTextScale(getTextScale(screenMini))
        }
    }, [elMini, screenMini, focus])

    const [screenFull, setScreenFull] = useState()
    useEffect(() => {
        const len = queue.length
        const result = queue.map((part, index) => {
            const key = `${index},${part}`
            if (part in SYMBOL) {
                return (
                    <React.Fragment key={key}>
                        {index >= len - 2 ? <br /> : <wbr />}
                        <span data-role={part} className={styles.operator}>
                            {SYMBOL[part as IKey['Operator']]}
                        </span>
                    </React.Fragment>
                )
            } else {
                return (
                    <span data-role="number" key={key}>
                        {index === len - 1
                            ? part
                            : new BigNumber(part).toFormat()}
                    </span>
                )
            }
        })

        setScreenFull(result)
    }, [queue])

    const elFull = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (elFull && elFull.current) {
            elFull.current.scrollTo({
                top: Number.MAX_SAFE_INTEGER
            })
        }
    }, [elFull, screenFull])

    return (
        <div data-role="calculator-screen" {...bindProps}>
            {focus || (
                <div
                    data-role="mini"
                    ref={elMini}
                    style={{ fontSize: `${textScale}em` }}
                >
                    {screenMini}
                </div>
            )}
            {focus && (
                <div data-role="mask">
                    <div data-role="full" ref={elFull}>
                        {screenFull}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Screen

let baseTextWidth: number
function getTextScale(text: string) {
    if (!baseTextWidth) {
        baseTextWidth = measure('1234567890123456', {
            fontFamily: styleVars.fontFamily
        }).width
    }
    const width = measure(text, {
        fontFamily: styleVars.fontFamily
    }).width

    return width < baseTextWidth ? 1 : baseTextWidth / width
}
