import React from 'react'

import { ScreenMini, Calculator } from '@/components/Calculator'

import { IRecord } from '@/model/types/record'

import styles from './Editor.module.scss'

const Amount: React.FC<{
    value: IRecord['amount']
    onUpdate: (value: IRecord['amount']) => void
}> = props => {
    const { value, onUpdate } = props

    const [show, setShow] = React.useState(false)

    return (
        <>
            <ScreenMini
                className={styles['amount-screen']}
                value={value}
                onClick={() => setShow(true)}
            />
            <Calculator
                value={value}
                onUpdate={onUpdate}
                show={show}
                onBlur={() => setShow(false)}
            />
        </>
    )
}

export default Amount
