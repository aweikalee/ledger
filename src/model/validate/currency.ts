import * as valid from './valid'
import { IValidate } from './types'
import { ICurrency, ICreateCurrency, IUpdateCurrency } from '../types/currency'

const validate: {
    [key in keyof (ICurrency & ICreateCurrency & IUpdateCurrency)]: IValidate
} = {
    _id: () => {
        return true
    },
    name: value => {
        return valid.queue<string>(
            [valid.minLength(0), valid.maxLength(3, true)],
            {
                name: '货币标识'
            }
        )(value)
    },
    cn: value => {
        return valid.queue<string>(
            [valid.minLength(0), valid.maxLength(10, true)],
            {
                name: '货币名称'
            }
        )(value)
    }
}

export default validate
