import React from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'
import BigNumberOrigin from 'bignumber.js'
import Grid from '@/components/Grid'
import { IGirdProps } from '@/components/Grid/Grid'
import Icon, { IIconProps } from '@/components/Icon/Icon'
import { localTimeOffset, offsetToUTC, timeTransform } from '@/utils/timeZone'
import { FORMAT_OPTIONS } from '@/components/Calculator/config'
import { format as amountFormatUtil } from '@/utils/amount'
import styles from './record.module.scss'
import color from '@/style/color.module.scss'
import { IRecord } from '@/model/types/record'
import { IClassify } from '@/model/types/classify'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export type IMiddleware = <T>(
    data: T
) => {
    [key in keyof T]: React.ReactNode
}

const getClassify = (id: string, classifies: IClassify[]) =>
    classifies.find(v => v._id === id) || {
        _id: '',
        text: '未分类',
        icon: 'image',
        color: 'grey'
    }

const TYPE_TO_SYMBOL = {
    '-1': '-',
    '0': '',
    '1': '+'
}
const formatAmount = (
    type: IRecord['type'] = 0,
    value: IRecord['amount'] = '0'
) => {
    const bignumber = new BigNumber(value)
    const symbol = TYPE_TO_SYMBOL[type]
    const str = amountFormatUtil(bignumber.toFixed(2), FORMAT_OPTIONS)
    const result = str.split('.')
    result[0] = `${symbol}${result[0]}`
    result[1] = `.${result[1]}`

    return result
}

export default (data: IRecord, classifies: IClassify[]) => {
    const classifyData = getClassify(data.classify || '', classifies)

    const classify: React.FC<React.HTMLAttributes<HTMLSpanElement>> = props => {
        return <span {...props}>{classifyData.text}</span>
    }

    const icon: React.FC<IGirdProps> = props => {
        const { className, ...other } = props
        return (
            <Grid
                className={clsx(
                    styles.icon,
                    color[`${classifyData.color}-bg`],
                    className
                )}
                justify="center"
                alignItems="center"
                {...other}
            >
                <Icon text={classifyData.icon as IIconProps['text']} />
            </Grid>
        )
    }

    const datetime: React.FC<React.HTMLAttributes<HTMLSpanElement> & {
        format?: string
    }> = props => {
        const { format: formatProps, ...other } = props
        const date = new Date(timeTransform.toLocal(data.datetime || 0))
        return (
            <span title={format(date, 'yyyy-MM-dd HH:mm:ss')} {...other}>
                {format(date, formatProps || 'yyyy-MM-dd HH:mm:ss')}
            </span>
        )
    }

    const timezone: React.FC<React.HTMLAttributes<HTMLSpanElement>> = props => {
        if (data.timezone !== undefined && data.timezone !== localTimeOffset) {
            return <span {...props}>{offsetToUTC(data.timezone)}</span>
        } else {
            return null
        }
    }

    const amount: React.FC<React.HTMLAttributes<HTMLSpanElement>> = props => {
        const { className, ...other } = props
        const [amountInt, amountFloat] = formatAmount(data.type, data.amount)
        return (
            <span
                className={clsx(styles.amount, className)}
                data-type={data.type || 0}
                {...other}
            >
                {amountInt}
                <span data-float>{amountFloat}</span>
            </span>
        )
    }

    const currency: React.FC<React.HTMLAttributes<HTMLSpanElement>> = props => {
        return <span {...props}>{data.currency}</span>
    }

    const detail: React.FC<React.HTMLAttributes<HTMLSpanElement>> = props => {
        return <span {...props}>{data.detail}</span>
    }

    return {
        classify,
        icon,
        datetime,
        timezone,
        amount,
        currency,
        detail
    }
}
