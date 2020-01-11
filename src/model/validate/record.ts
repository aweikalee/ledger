import BigNumberOrigin from 'bignumber.js'
import * as valid from './valid'
import { IValidate } from './types'
import { IRecord, ICreateRecord, IUpdateRecord } from '../types/record'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

const validate: {
    [key in keyof (IRecord & ICreateRecord & IUpdateRecord)]: IValidate
} = {
    _id: () => {
        return true
    },
    type: value => {
        return valid.queue<number>(
            [
                (value, options = {}) => {
                    return (
                        value === -1 ||
                        value === 1 ||
                        value === 0 ||
                        valid.errorFactory('{name}不合法', options)
                    )
                }
            ],
            {
                name: '类型'
            }
        )(value)
    },
    classify: value => {
        return valid.queue<string>([valid.isRequire()], {
            name: '分类'
        })(value)
    },
    datetime: value => {
        return valid.queue<string>([valid.isRequire(), valid.isDate()], {
            name: '时间'
        })(value)
    },
    detail: value => {
        return valid.queue<string>([valid.maxLength(140)], {
            name: '描述'
        })(value)
    },
    amount: value => {
        return valid.queue<string>(
            [
                (value, options = {}) => {
                    const number = new BigNumber(value || '').toString()
                    return (
                        number === value ||
                        valid.errorFactory('{name}不合法', options)
                    )
                },
                valid.maxLength(20)
            ],
            {
                name: '金额'
            }
        )(value)
    },
    currency: value => {
        return valid.queue<string>([valid.isRequire()], {
            name: '货币种类'
        })(value)
    },
    payer: value => {
        return valid.queue<string>([], {
            name: '支付方'
        })(value)
    },
    participator: value => {
        return valid.queue<string>([], {
            name: '消费方'
        })(value)
    },
    settled: value => {
        return valid.queue<string>([], {
            name: '已还清'
        })(value)
    }
}

export default validate
