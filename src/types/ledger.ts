import { IClassify } from './classify'
import { IMember } from './member'

export interface ILedger {
    _id?: string
    title?: string
    owner?: string
    classifies?: IClassify[]
    members?: IMember[]
    createdAt?: number
    updatedAt?: number
    sort?: number
}
