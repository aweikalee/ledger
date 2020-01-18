import React from 'react'

import { IRecord } from '@/model/types/record'

const Classify: React.FC<{
    value: IRecord['classify']
    onUpdate: (value: IRecord['classify']) => void
}> = props => {
    const { value } = props

    return <>{value}</>
}

export default Classify
