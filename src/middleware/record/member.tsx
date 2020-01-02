import { IRecord } from '@/types/record'
import { IMember } from '@/types/member'

export interface IMemberEx extends IMember {
    payer: boolean
    participator: boolean
    settled: boolean
}

export default (data: IRecord, members: IMember[]) => {
    const { payer = [], participator = [], settled = [] }: typeof data = data

    const result: IMemberEx[] = []

    const ids = new Set<string>([
        ...members.map(m => m._id || ''),
        ...payer,
        ...participator,
        ...settled
    ])

    ids.forEach(id => {
        const member = members.find(m => m._id === id) || {
            id,
            name: '未定义'
        }
        const item = Object.assign(
            {
                payer: payer.includes(id),
                participator: participator.includes(id),
                settled: settled.includes(id)
            },
            member
        )
        result.push(item)
    })

    return result
}
