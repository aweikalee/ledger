import React from 'react'

import { Input } from '@/components/Input'

import { IClassify } from '@/model/types/classify'

const Text: React.FC<{
    value: IClassify['text']
    onUpdate: (value: IClassify['text']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <Input
            name="text"
            id="text"
            placeholder="分类名称"
            value={value}
            onChange={e => onUpdate(e.target.value)}
        />
    )
}

export default Text
