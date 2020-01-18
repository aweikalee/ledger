import * as valid from './valid'
import { IValidate } from './types'
import { IMember, ICreateMember, IUpdateMember } from '../types/member'

const validate: {
    [key in keyof (IMember & ICreateMember & IUpdateMember)]: IValidate
} = {
    _id: () => {
        return true
    },
    name: value => {
        return valid.queue<string>(
            [valid.minLength(0), valid.maxLength(6, true)],
            {
                name: '昵称'
            }
        )(value)
    }
}

export default validate
