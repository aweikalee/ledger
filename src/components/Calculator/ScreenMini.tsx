import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import BigNumberOrigin from 'bignumber.js'
import measure from '../utils/measure'
import * as amount from '@/utils/amount'
import styles from './Screen.module.scss'
import styleVars from '@/style/index.module.scss'
import { FORMAT_OPTIONS } from './config'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface IKeyboradScreenProps
    extends React.HTMLAttributes<HTMLElement> {
    value?: string
}

const Screen: React.FC<IKeyboradScreenProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        value = '0',
        ...other
    }: typeof props = props

    const [screen, setScreen] = useState<string>('0.00')
    useEffect(() => {
        setScreen(getScreenValue(value))
    }, [value])

    const [textScale, setTextScale] = useState(1)
    useEffect(() => {
        setTextScale(getTextScale(screen))
    }, [screen])

    const className = clsx(styles['screen-mini'], classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <div data-role="calculator-screen-mini" {...bindProps}>
            <span data-role="mini" style={{ fontSize: `${textScale}em` }}>
                {screen}
            </span>
        </div>
    )
}

export default Screen

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
