import React from 'react'

import { ILedger } from '@/model/types/ledger'
import { IRecord } from '@/model/types/record'

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
    return <></>
}

export default Members
