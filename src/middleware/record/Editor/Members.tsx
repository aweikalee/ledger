import React from 'react'

import { ILedger } from '@/model/types/ledger'
import { IRecord } from '@/model/types/record'

import * as display from '../display'

const Members: React.FC<{
    payer: IRecord['payer']
    participator: IRecord['participator']
    settled: IRecord['settled']
    members: ILedger['members']
    onUpdate: (
        type: 'payer' | 'participator' | 'settled',
        value: string[]
    ) => void
}> = props => {
    const { onUpdate, ...other } = props
    return (
        <display.Members
            display="checkbox"
            {...other}
            onUpdate={(type, value) => {
                const target = props[type]
                if (!target) {
                    return onUpdate(type, [value])
                }
                const index = target.indexOf(value)
                if (index === -1) {
                    onUpdate(type, [...target, value])
                } else {
                    onUpdate(type, [...target].splice(index, 1))
                }
            }}
        />
    )
}

export default Members
