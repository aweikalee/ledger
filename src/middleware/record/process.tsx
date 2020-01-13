import { format } from 'date-fns'
import BigNumberOrigin from 'bignumber.js'

import { FORMAT_OPTIONS } from '@/components/Calculator/config'

import { timeTransform, offsetToUTC, localTimeOffset } from '@/utils/timeZone'
import { format as amountFormatUtil } from '@/utils/amount'
import { IRecord } from '@/model/types/record'
import { IClassify } from '@/model/types/classify'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

/* ======================================== */

export const getClassify = (
    id: string | undefined,
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
    datetime: number,
    formatString: string = 'yyyy-MM-dd HH:mm:ss'
) => {
    const date = new Date(timeTransform.toLocal(datetime))
    return format(date, formatString)
}

/* ======================================== */

export const timezone = (timezone?: number) => {
    if (timezone !== undefined && timezone !== localTimeOffset) {
        return offsetToUTC(timezone)
    }
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
