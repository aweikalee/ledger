export interface IRecord {
    id?: string
    type?: -1 | 0 | 1
    classify?: string
    timezone?: number
    datetime?: string
    detail?: string
    amount?: string
    currency?: string
    rate?: number
    payer?: string[]
    participator?: string[]
    settled?: string[]
}