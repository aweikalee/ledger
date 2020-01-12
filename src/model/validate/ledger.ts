import * as valid from './valid'
import { IValidate } from './types'
import { ILedger, ICreateLedger, IUpdateLedger } from '../types/ledger'

const validate: {
    [key in keyof (ILedger & ICreateLedger & IUpdateLedger)]: IValidate
} = {
    _id: () => {
        return true
    },
    title: value => {
        return valid.queue<string>(
            [valid.minLength(0), valid.maxLength(8, true)],
            {
                name: '标题'
            }
        )(value)
    }
}

export default validate
