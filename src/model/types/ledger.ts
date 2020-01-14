import { IStatus } from './status'
import { IClassify } from './classify'
import { IMember } from './member'

export interface ILedger {
    _id?: string
    title?: string
    classifies?: IClassify[]
    members?: IMember[]
    createdAt?: number
    updatedAt?: number
    sort?: number
}

export interface ICreateLedger {
    title?: string
    sort?: number
}

export interface IUpdateLedger {
    _id: string
    title?: string
    sort?: number
    status?: IStatus
    deleted?: boolean
}
