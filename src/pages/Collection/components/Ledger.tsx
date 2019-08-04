import React from 'react'
import { Button } from '@/components/Button'
import styles from './Ledger.module.scss'

const Ledger: React.FC = props => {
    return (
        <Button
            color="primary"
            type="contained"
            className={styles.ledger}
            block
        >
            旅a
        </Button>
    )
}

export default Ledger
