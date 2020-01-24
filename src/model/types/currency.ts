import { IStatus } from './status'

export interface ICurrency {
    _id?: string
    name?: string
    cn?: string
}

export interface ICreateCurrency {
    name?: string
    cn?: string
}

export interface IUpdateCurrency {
    _id?: string
    name?: string
    cn?: string
    status?: IStatus
    deleted?: boolean
}
