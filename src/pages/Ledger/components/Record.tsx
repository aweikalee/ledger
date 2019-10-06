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
import { format as amountFormatUtil } from '@/utils/amount'
import config from '@/config'
import { FORMAT_OPTIONS } from '@/components/Calculator/config'
import BigNumberOrigin from 'bignumber.js'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface IClassify {
    id: string
    text: string
    icon: IIconProps['text']
    color: keyof typeof color
}
export interface IRecord {
    id: string
    type: -1 | 0 | 1
    classify: string
    timezone: number
    datetime: string
    amount: string
    currency: string
    detail: string
}

const Ledger: React.FC<
    IRecord & {
        classifyData: IClassify
        style?: CSSProperties
        className?: React.HTMLAttributes<HTMLElement>['className']
    }
> = props => {
    const {
        id,
        type,
        classifyData,
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
            className={clsx(styles.icon, color[`${classifyData.color}-bg`])}
            sm="auto"
            justify="center"
            alignItems="center"
        >
            <Icon text={classifyData.icon as IIconProps['text']} />
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
            <span title={classifyData.text}>{classifyData.text}</span>
            <span title={format(new Date(datetime), 'yyyy-MM-dd HH:mm:ss')}>
                {format(new Date(datetime), 'HH:mm')}
            </span>
            {/* 时区 */}
            {timezone !== localTimeOffset ? (
                <span className={styles.timezone}>{offsetToUTC(timezone)}</span>
            ) : null}
        </Grid>
    )

    const [amountInt, amountFloat] = formatAmount(type, amount)
    const childAmount = (
        <Grid sm wrap="nowrap" justify="flex-end" alignItems="baseline">
            <div
                className={clsx(
                    styles.amount,
                    {
                        '-1': styles.outgoing,
                        '0': styles.outgoing,
                        '1': styles.income
                    }[type]
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

const TYPE_TO_SYMBOL = {
    '-1': '-',
    '0': '',
    '1': '+'
}
function formatAmount(type: IRecord['type'], value: IRecord['amount']) {
    const bignumber = new BigNumber(value)
    const symbol = TYPE_TO_SYMBOL[type]
    const str = amountFormatUtil(bignumber.toFixed(2), FORMAT_OPTIONS)
    const result = str.split('.')
    result[0] = `${symbol}${result[0]}`
    result[1] = `.${result[1]}`

    return result
}
