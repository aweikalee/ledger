import React from 'react'

import { Button, Group as ButtonGroup } from '@/components/Button'

import { IRecord } from '@/model/types/record'

import styles from './Editor.module.scss'

const TYPE_OPTION: {
    value: IRecord['type']
    text: string
}[] = [
    {
        value: -1,
        text: '支出'
    },
    {
        value: 0,
        text: '转账'
    },
    {
        value: 1,
        text: '收入'
    }
]

const Type: React.FC<{
    value: IRecord['type']
    onUpdate: (value: IRecord['type']) => void
}> = props => {
    const { value, onUpdate } = props

    return (
        <ButtonGroup className={styles['type-group']}>
            {TYPE_OPTION.map(item => (
                <Button
                    type={value === item.value ? 'contained' : 'outlined'}
                    color="primary"
                    size="small"
                    border="round"
                    key={item.value}
                    onClick={() => {
                        onUpdate(item.value)
                    }}
                >
                    {item.text}
                </Button>
            ))}
        </ButtonGroup>
    )
}

export default Type
