import React from 'react'
import { Button } from '@/components/Button'
import styles from './Ledger.module.scss'

export interface ILedger {
    id: string
    title: string
}

const Ledger: React.FC<ILedger> = props => {
    const { id, title } = props

    return (
        <Button
            color="primary"
            type="contained"
            className={styles.ledger}
            href={`/ledger/${id}`}
            block
        >
            {title}
        </Button>
    )
}

export default Ledger
