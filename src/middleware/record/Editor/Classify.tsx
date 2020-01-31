import React from 'react'
import clsx from 'clsx'

import Button from '@/components/Button'

import { IRecord } from '@/model/types/record'
import { ILedger } from '@/model/types/ledger'
import { IClassify } from '@/model/types/classify'

import * as process from '../process'
import * as display from '../display'

import styles from './Editor.module.scss'

const Item: React.FC<{
    value: IClassify
    active: boolean
    onUpdate: (value: IRecord['classify']) => void
}> = ({ value, active = false, onUpdate }) => {
    return (
        <Button
            data-active={active}
            key={value._id || value.text}
            type="text"
            color="default"
            block
            onClick={() => onUpdate(value._id)}
            style={{padding: 0}}
        >
            <display.Icon
                className={clsx(styles.classify__icon)}
                classify={value}
            />
            <div className={styles.classify__text}>{value.text}</div>
        </Button>
    )
}

const Classify: React.FC<{
    value: IRecord['classify']
    classifies: ILedger['classifies']
    onUpdate: (value: IRecord['classify']) => void
}> = props => {
    const { value, classifies = [], onUpdate }: typeof props = props

    return (
        <div className={styles.classify} id="classify">
            <Item
                value={process.defaultClassify}
                active={!classifies.find(v => v._id === value)}
                onUpdate={onUpdate}
            />
            {classifies.map(v => (
                <Item
                    key={v._id}
                    value={v}
                    active={v._id === value}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    )
}

export default Classify
