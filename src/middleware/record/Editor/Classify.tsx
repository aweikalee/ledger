import React from 'react'
import clsx from 'clsx'

import Button from '@/components/Button'

import { IRecord } from '@/model/types/record'
import { ILedger } from '@/model/types/ledger'

import * as process from '../process'
import * as display from '../display'

import styles from './Editor.module.scss'

const Classify: React.FC<{
    value: IRecord['classify']
    classifies: ILedger['classifies']
    onUpdate: (value: IRecord['classify']) => void
}> = props => {
    const { value, classifies = [], onUpdate }: typeof props = props

    return (
        <div className={styles.classify}>
            {[process.defaultClassify, ...classifies].map(item => (
                <Button
                    data-active={item._id === value}
                    key={item._id || item.text}
                    type="text"
                    color="default"
                    block
                    onClick={() => onUpdate(item._id)}
                >
                    <display.Icon
                        className={clsx(styles.classify__icon)}
                        classify={item}
                    />
                    <div className={styles.classify__text}>{item.text}</div>
                </Button>
            ))}
        </div>
    )
}

export default Classify
