import * as valid from './valid'
import { IValidate } from './types'
import { IClassify, ICreateClassify, IUpdateClassify } from '../types/classify'

const validate: {
    [key in keyof (IClassify & ICreateClassify & IUpdateClassify)]: IValidate
} = {
    _id: () => {
        return true
    },
    text: value => {
        return valid.queue<string>(
            [valid.minLength(0), valid.maxLength(6, true)],
            {
                name: '名称'
            }
        )(value)
    }
}

export default validate
