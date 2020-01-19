import { IStatus } from './status'

export interface IRecord {
    _id?: string
    pid?: string
    type?: -1 | 0 | 1
    classify?: string | null
    timezone?: number
    datetime?: number
    detail?: string
    amount?: string
    currency?: string
    rate?: number
    payer?: string[]
    participator?: string[]
    settled?: string[]
}

export interface ICreateRecord {
    pid?: string
    type?: -1 | 0 | 1
    classify?: string | null
    timezone?: number
    datetime?: number
    detail?: string
    amount?: string
    currency?: string
    rate?: number
    payer?: string[]
    participator?: string[]
    settled?: string[]
}

export interface IUpdateRecord {
    _id: string
    pid?: string
    type?: -1 | 0 | 1
    classify?: string | null
    timezone?: number
    datetime?: number
    detail?: string
    amount?: string
    currency?: string
    rate?: number
    payer?: string[]
    participator?: string[]
    settled?: string[]
    status?: IStatus
    deleted?: boolean
}
