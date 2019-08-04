import React from 'react'
import clsx from 'clsx'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import styles from './Record.module.scss'

export interface IRecordProps {
    type: string
    amount: number
    currency: string
    timestamp: number
    detail: string
}

const Ledger: React.FC<IRecordProps> = props => {
    const { type, amount, currency, timestamp, detail }: typeof props = props

    const childIcon = (
        <Grid
            item
            className={styles.icon}
            sm="auto"
            justify="center"
            alignItems="center"
        >
            <Icon text="user" />
        </Grid>
    )
    const childTime = (
        <Grid className={styles.time} item sm="auto" title={`${timestamp}`}>
            14:29 {type}
        </Grid>
    )

    const [amountInt, amountFloat] = formatAmount(amount)
    const childAmount = (
        <Grid
            className={clsx(
                styles.amount,
                amount > 0 ? styles.income : styles.outgoing
            )}
            item
            block
            sm
            wrap="nowrap"
        >
            {amountInt}
            <span style={{ fontSize: '0.8em' }}>{amountFloat}</span>
        </Grid>
    )

    const childDetail = (
        <Grid className={styles.detail} item block sm>
            {detail}
        </Grid>
    )

    const childCurrency = (
        <Grid className={styles.currency} item sm="auto">
            {currency}
        </Grid>
    )

    return (
        <Grid
            className={styles.record}
            container
            justify="center"
            alignItems="center"
        >
            {childIcon}
            <Grid className={styles.main} item sm>
                <Grid item sm={12} alignItems="baseline">
                    {childTime}
                    {childAmount}
                </Grid>
                <Grid item sm={12} alignItems="baseline">
                    {childDetail}
                    {childCurrency}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Ledger

function formatAmount(amount: number) {
    const symbol = amount > 0 ? '+' : '-'
    const int = Math.floor(amount)
    const float = (amount - int).toFixed(2)
    return [`${symbol}${Math.abs(int)}`, `${float}`.slice(-3)]
}
