import React from 'react'

import { TextArea } from '@/components/Input'

import { IRecord } from '@/model/types/record'

const Classify: React.FC<{
    value: IRecord['detail']
    onUpdate: (value: IRecord['detail']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <TextArea
            name="detail"
            id="detail"
            value={value}
            onChange={e => onUpdate(e.target.value)}
            autosize
        />
    )
}

export default Classify
