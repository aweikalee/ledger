import React from 'react'

import { Input } from '@/components/Input'

import { ICurrency } from '@/model/types/currency'

const Name: React.FC<{
    value: ICurrency['name']
    onUpdate: (value: ICurrency['name']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <Input
            name="name"
            id="name"
            placeholder="货币标识"
            value={value}
            onChange={e => onUpdate(e.target.value)}
        />
    )
}

export default Name
