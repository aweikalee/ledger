import React from 'react'
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
    }
> = props => {
    const {
        id,
        recordType,
        timezone,
        datetime,
        amount,
        currency,
        detail
    }: typeof props = props

    const childIcon = (
        <Grid
            item
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
            item
            sm="auto"
            alignItems="center"
            title={`${format(new Date(datetime), config.datetimeFormat)}`}
        >
            {/* 类型、时间 */}
            <span title={recordType.text}>{recordType.text}</span>
            <span title={format(new Date(datetime), 'yyyy-MM-dd HH:mm:ss')}>{format(new Date(datetime), 'HH:mm')}</span>
            {/* 时区 */}
            {timezone !== localTimeOffset ? (
                <span className={styles.timezone}>{offsetToUTC(timezone)}</span>
            ) : null}
        </Grid>
    )

    const [amountInt, amountFloat] = formatAmount(amount)
    const childAmount = (
        <Grid
            className={clsx(
                styles.amount,
                amount > 0 ? styles.income : styles.outgoing
            )}
            item
            block
            sm
            wrap="nowrap"
        >
            {amountInt}
            <span style={{ fontSize: '0.8em' }}>{amountFloat}</span>
        </Grid>
    )

    const childDetail = (
        <Grid className={styles.detail} item block sm>
            {detail}
        </Grid>
    )

    const childCurrency = (
        <Grid className={styles.currency} item sm="auto">
            {currency}
        </Grid>
    )

    return (
        <Link to={`/record/${id}`} className={styles.record}>
            <Grid container justify="center" alignItems="center">
                {childIcon}
                <Grid className={styles.main} item sm>
                    <Grid item sm={12} alignItems="baseline">
                        {childTime}
                        {childAmount}
                    </Grid>
                    <Grid item sm={12} alignItems="baseline">
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
