import React from 'react'

import { Input } from '@/components/Input'

import { IMember } from '@/model/types/member'

const Name: React.FC<{
    value: IMember['name']
    onUpdate: (value: IMember['name']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <Input
            name="name"
            id="name"
            placeholder="成员昵称"
            value={value}
            onChange={e => onUpdate(e.target.value)}
        />
    )
}

export default Name
