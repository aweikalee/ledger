import React from 'react'
import clsx from 'clsx'

import Grid, { IGirdProps } from '@/components/Grid/Grid'
import IconComponet, { IIconProps } from '@/components/Icon/Icon'

import { localTimeOffset, offsetToUTC } from '@/utils/timeZone'
import { IRecord } from '@/model/types/record'
import { IClassify } from '@/model/types/classify'

import * as process from './process'

import color from '@/style/color.module.scss'
import styles from './styles.module.scss'

/* ======================================== */

export interface IRecordIconProps extends IGirdProps {
    classify: IClassify
}

export const Icon: React.FC<IRecordIconProps> = props => {
    const { className, classify, ...other } = props
    return (
        <Grid
            className={clsx(
                styles.icon,
                color[`${classify.color}-bg`],
                className
            )}
            justify="center"
            alignItems="center"
            {...other}
        >
            <IconComponet text={classify.icon as IIconProps['text']} />
        </Grid>
    )
}

/* ======================================== */

export interface IRecordDatetimeProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    datetime?: IRecord['datetime']
    format?: string
}
export const Datetime: React.FC<IRecordDatetimeProps> = props => {
    const { datetime, format = 'yyyy-MM-dd HH:mm:ss', ...other } = props

    if (!datetime) {
        return null
    }

    return (
        <span title={process.datetime(datetime)} {...other}>
            {process.datetime(datetime, format)}
        </span>
    )
}

/* ======================================== */

export interface IRecordTimezoneProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    timezone?: IRecord['timezone']
}
export const Timezone: React.FC<IRecordTimezoneProps> = props => {
    const { className, timezone, ...other } = props

    const utc = process.timezone(timezone)

    return !utc ? null : (
        <span className={clsx(styles.timezone, className)} {...other}>
            {utc}
        </span>
    )
}

/* ======================================== */

export interface IRecordAmountProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    type?: IRecord['type']
    amount?: IRecord['amount']
}
export const Amount: React.FC<IRecordAmountProps> = props => {
    const { className, type, amount, ...other } = props

    const [amountInt, amountFloat] = process.amount(type, amount)

    return (
        <span
            className={clsx(styles.amount, className)}
            data-type={type || 0}
            {...other}
        >
            {amountInt}
            <span data-float>{amountFloat}</span>
        </span>
    )
}
