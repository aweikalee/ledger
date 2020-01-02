export interface IRecord {
    _id?: string
    pid?: string
    type?: -1 | 0 | 1
    classify?: string
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