import React from 'react'

import { Input } from '@/components/Input'

import { ICurrency } from '@/model/types/currency'

const Cn: React.FC<{
    value: ICurrency['cn']
    onUpdate: (value: ICurrency['cn']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <Input
            name="cn"
            id="cn"
            placeholder="货币名称"
            value={value}
            onChange={e => onUpdate(e.target.value)}
        />
    )
}

export default Cn
