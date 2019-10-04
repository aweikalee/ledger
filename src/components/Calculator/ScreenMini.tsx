import React, { useRef, useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import BigNumberOrigin from 'bignumber.js'
import measure from '../utils/measure'
import * as amount from '@/utils/amount'
import styles from './Screen.module.scss'
import styleVars from '@/style/index.module.scss'
import { FORMAT_OPTIONS } from './config'
import useResizeObserver from '../utils/useResizeObserver'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface IKeyboradScreenProps
    extends React.HTMLAttributes<HTMLElement> {
    value?: string
}

const Component = React.forwardRef<HTMLDivElement, IKeyboradScreenProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children: childrenProp,
            value = '0',
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const [screen, setScreen] = useState<string>('0.00')
        useEffect(() => {
            setScreen(getScreenValue(value))
        }, [value])

        const [textScale, setTextScale] = useState(1)

        const resizeHandler = useCallback(() => {
            if (!el.current) {
                return
            }

            const base = el.current.offsetWidth
            const { fontSize } = getComputedStyle(el.current)
            const width = measure(screen, {
                fontFamily: styleVars.fontFamily,
                fontSize: fontSize || '0.68rem'
            }).width

            setTextScale(width < base ? 1 : (base / width) * 0.95)
        }, [screen])

        useEffect(() => {
            resizeHandler()
        }, [resizeHandler])

        useResizeObserver(el, resizeHandler)

        const className = clsx(styles['screen-mini'], classNameProp)
        const bindProps = {
            className,
            ...other
        }

        return (
            <div data-role="calculator-screen-mini" ref={el} {...bindProps}>
                <span data-role="mini" style={{ fontSize: `${textScale}em` }}>
                    {screen}
                </span>
            </div>
        )
    }
)

Component.displayName = 'CalculatorScreenMini'
export default Component

function getScreenValue(value: string) {
    const bignumber = new BigNumber(value)
    let result
    if (value.length > 24) {
        result = bignumber
            .toExponential(18)
            .replace(/^(\d+\.\d{2,}?)0+(e[+-]\d+)$/, '$1$2')
            .replace(/(^\d+(\.\d+)?)/, match => {
                return amount.format(match, FORMAT_OPTIONS)
            })
    } else {
        result = amount.format(bignumber.toFixed(2), FORMAT_OPTIONS)
    }
    return result
}
