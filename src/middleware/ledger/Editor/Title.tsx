import React from 'react'

import { Input } from '@/components/Input'

import { ILedger } from '@/model/types/ledger'

const Title: React.FC<{
    value: ILedger['title']
    onUpdate: (value: ILedger['title']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <Input
            name="title"
            id="title"
            placeholder="账簿名称"
            value={value}
            onChange={e => onUpdate(e.target.value)}
        />
    )
}

export default Title
