import { format } from 'date-fns'
import BigNumberOrigin from 'bignumber.js'

import { FORMAT_OPTIONS } from '@/components/Calculator/config'

import { timeTransform, offsetToUTC, localTimeOffset } from '@/utils/timeZone'
import { getMonthLastDay } from '@/utils/datetime'
import { format as amountFormatUtil } from '@/utils/amount'
import { IRecord } from '@/model/types/record'
import { IClassify } from '@/model/types/classify'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

/* ======================================== */

export const getClassify = (
    id: IRecord['classify'],
    classifies: IClassify[]
) => {
    return (
        classifies.find(v => v._id === id) || {
            _id: '',
            text: '未分类',
            icon: 'image',
            color: 'grey'
        }
    )
}

/* ======================================== */

export const datetime = (
    datetime: IRecord['datetime'] = 0,
    formatString: string = 'yyyy-MM-dd HH:mm:ss'
) => {
    const date = new Date(timeTransform.toLocal(datetime))
    return format(date, formatString)
}

/* ======================================== */

export const timezone = (timezone?: IRecord['timezone']) => {
    if (timezone !== undefined && timezone !== localTimeOffset) {
        return offsetToUTC(timezone)
    }
}

/* ======================================== */

export const getMonthRange = (datetime?: IRecord['datetime']) => {
    const date = new Date(datetime || Date.now())
    const maxDay = getMonthLastDay(date)

    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    const start = date.getTime()
    const end = start + maxDay * 24 * 60 * 60 * 100

    return [start, end]
}

/* ======================================== */

const TYPE_TO_SYMBOL = {
    '-1': '-',
    '0': '',
    '1': '+'
}

export const amount = (
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
