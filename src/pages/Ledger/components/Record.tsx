import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import styles from './Record.module.scss'
import color from '../../../style/color.module.scss'
import { IIconProps } from '@/components/Icon/Icon'
import { format } from 'date-fns'
import { localTimeOffset, offsetToUTC } from '@/utils/timeZone'
import config from '@/config'

export interface IRecordType {
    id: string
    text: string
    icon: IIconProps['text']
    color: keyof typeof color
}
export interface IRecord {
    id: string
    type: string
    timezone: number
    datetime: string
    amount: number
    currency: string
    detail: string
}

const Ledger: React.FC<
    IRecord & {
        recordType: IRecordType
        style?: CSSProperties
        className?: React.HTMLAttributes<HTMLElement>['className']
    }
> = props => {
    const {
        id,
        recordType,
        timezone,
        datetime,
        amount,
        currency,
        detail,
        style,
        className
    }: typeof props = props

    const childIcon = (
        <Grid
            className={clsx(styles.icon, color[`${recordType.color}-bg`])}
            sm="auto"
            justify="center"
            alignItems="center"
        >
            <Icon text={recordType.icon as IIconProps['text']} />
        </Grid>
    )
    const childTime = (
        <Grid
            className={styles.time}
            sm="auto"
            alignItems="center"
            title={`${format(new Date(datetime), config.datetimeFormat)}`}
        >
            {/* 类型、时间 */}
            <span title={recordType.text}>{recordType.text}</span>
            <span title={format(new Date(datetime), 'yyyy-MM-dd HH:mm:ss')}>
                {format(new Date(datetime), 'HH:mm')}
            </span>
            {/* 时区 */}
            {timezone !== localTimeOffset ? (
                <span className={styles.timezone}>{offsetToUTC(timezone)}</span>
            ) : null}
        </Grid>
    )

    const [amountInt, amountFloat] = formatAmount(amount)
    const childAmount = (
        <Grid sm wrap="nowrap" justify="flex-end" alignItems="baseline">
            <div
                className={clsx(
                    styles.amount,
                    amount > 0 ? styles.income : styles.outgoing
                )}
            >
                {amountInt}
                <span style={{ fontSize: '0.8em' }}>{amountFloat}</span>
            </div>
        </Grid>
    )

    const childDetail = (
        <Grid sm>
            <div className={styles.detail}>{detail}</div>
        </Grid>
    )

    const childCurrency = <Grid className={styles.currency}>{currency}</Grid>

    return (
        <Link
            to={`/record/${id}`}
            className={clsx(styles.record, className)}
            style={style}
        >
            <Grid container justify="center" alignItems="center">
                {childIcon}
                <Grid className={styles.main} sm direction="column">
                    <Grid sm={12} alignItems="baseline">
                        {childTime}
                        {childAmount}
                    </Grid>
                    <Grid sm={12} alignItems="baseline">
                        {childDetail}
                        {childCurrency}
                    </Grid>
                </Grid>
            </Grid>
        </Link>
    )
}

export default Ledger

function formatAmount(amount: number) {
    const symbol = amount > 0 ? '+' : '-'
    const int = Math.floor(amount)
    const float = (amount - int).toFixed(2)
    return [`${symbol}${Math.abs(int)}`, `${float}`.slice(-3)]
}
