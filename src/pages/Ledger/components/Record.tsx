import React from 'react'
import { Link } from 'react-router-dom'
import Grid from '@/components/Grid'
import styles from './Record.module.scss'
import middleware from '@/middleware/record/record'
import { IRecord } from '@/types/record'
import { IClassify } from '@/types/classify'

const Ledger: React.FC<IRecord & {
    classifies: IClassify[]
}> = (props) => {
    const { _id, classifies, ...other }: typeof props = props

    const Middle = middleware(other, classifies)

    const childIcon = <Middle.icon sm="auto" className={styles.icon} />
    const childTime = (
        <Grid className={styles.time} sm="auto" alignItems="center">
            {/* 类型、时间 */}
            <Middle.classify />
            <Middle.datetime format="HH:mm" />
            {/* 时区 */}
            <Middle.timezone className={styles.timezone} />
        </Grid>
    )

    const childAmount = (
        <Grid sm wrap="nowrap" justify="flex-end" alignItems="baseline">
            <Middle.amount />
        </Grid>
    )

    const childDetail = (
        <Grid sm>
            <Middle.detail className={styles.detail} />
        </Grid>
    )

    const childCurrency = (
        <Grid className={styles.currency}>
            <Middle.currency />
        </Grid>
    )

    return (
        <Link to={`/record/${_id}`} className={styles.record}>
            <Grid container justify="center" alignItems="center">
                {childIcon}
                <Grid className={styles.main} sm direction="column">
                    <Grid sm={12} alignItems="baseline">
                        {childTime}
                        {childAmount}
                    </Grid>
                    <Grid sm={12} alignItems="baseline">
                        {childDetail}
                        {childCurrency}
                    </Grid>
                </Grid>
            </Grid>
        </Link>
    )
}

export default Ledger
