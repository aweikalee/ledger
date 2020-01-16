import React from 'react'
import { Link } from 'react-router-dom'

import Grid from '@/components/Grid'

import { useStore } from '@/store'
import { IRecord } from '@/model/types/record'
import * as display from '@/middleware/record/display'
import * as process from '@/middleware/record/process'

import indexContext from '../context'

import styles from './Item.module.scss'

export interface ILedgerIndexItemProps extends IRecord {}

const LedgerIndexItem: React.FC<ILedgerIndexItemProps> = props => {
    const { _id } = props

    const { ledger } = useStore()
    const { deleted } = React.useContext(indexContext)

    if (!_id || deleted[_id]) {
        return null
    }

    const classifies = (ledger.data && ledger.data.classifies) || []
    const classify = process.classify(props.classify, classifies)

    const childIcon = display.Icon({
        className: styles.icon,
        classify,
        sm: 'auto',
        title: classify.text
    })

    const childDatetime = display.Datetime({
        datetime: props.datetime,
        format: 'MM-dd HH:mm'
    })

    const childTimezone = display.Timezone({
        timezone: props.timezone
    })

    const childAmount = display.Amount({
        type: props.type,
        amount: props.amount
    })

    return (
        <Link to={`/record/${_id}`} className={styles.record}>
            <Grid container justify="center" alignItems="center">
                {childIcon}
                <Grid sm direction="column" className={styles.main}>
                    <Grid sm={12} alignItems="baseline">
                        <Grid
                            sm="auto"
                            alignItems="center"
                            className={styles.time}
                        >
                            {/* 类型 */}
                            {/* {classify.text} */}

                            {/* 时间、时区 */}
                            {childDatetime}
                            {childTimezone}
                        </Grid>
                        <Grid
                            sm
                            wrap="nowrap"
                            justify="flex-end"
                            alignItems="baseline"
                        >
                            {/* 金额 */}
                            {childAmount}
                        </Grid>
                    </Grid>
                    <Grid sm={12} alignItems="baseline">
                        <Grid sm className={styles.detail}>
                            {/* 描述 */}
                            {props.detail}
                        </Grid>
                        <Grid className={styles.currency}>
                            {/* 货币种类 */}
                            {props.currency}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Link>
    )
}

export default LedgerIndexItem
