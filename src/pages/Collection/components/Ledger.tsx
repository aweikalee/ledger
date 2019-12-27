import React from 'react'
import { Button } from '@/components/Button'
import styles from './Ledger.module.scss'

export interface ILedger {
    _id: string
    title: string
    sort: number
}

const Ledger: React.FC<ILedger> = props => {
    const { _id, title } = props

    return (
        <Button
            color="primary"
            type="contained"
            className={styles.ledger}
            href={`/ledger/${_id}`}
            block
        >
            {title}
        </Button>
    )
}

export default Ledger
