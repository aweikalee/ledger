import React from 'react'
import { Button } from '@/components/Button'
import styles from './Ledger.module.scss'
import { ILedger } from '@/model/types/ledger'

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
