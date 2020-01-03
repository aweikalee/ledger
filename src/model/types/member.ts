import { IStatus } from './status'

export interface IMember {
    _id?: string
    pid?: string
    name?: string
}

export interface ICreateMember {
    pid?: string
    name?: string
}

export interface IUpdateMember {
    _id?: string
    pid?: string
    name?: string
    status?: IStatus
    deleted?: boolean
}
