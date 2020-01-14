import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Popup from '@/components/Popup'
import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

import { useStore } from '@/store'
import { useRecord } from '@/model/api/record'
import { IRecord } from '@/model/types/record'
import * as display from '@/middleware/record/display'
import * as process from '@/middleware/record/process'

import styles from './Detail.module.scss'
import membersStyles from '@/middleware/record/styles.module.scss'

export interface IRecordIndexDeitalRouteProps {
    id: string
}

export interface IRecordIndexDeitalProps {
    record: ReturnType<typeof useRecord>
}

const Detail: React.FC<IRecord> = props => {
    const { ledger } = useStore()

    const members = (ledger.data && ledger.data.members) || []

    const classifies = (ledger.data && ledger.data.classifies) || []
    const classify = process.classify(props.classify, classifies)

    const childIcon = display.Icon({
        classify,
        sm: 'auto',
        title: classify.text
    })

    const childDatetime = display.Datetime({
        datetime: props.datetime
    })

    const childTimezone = display.Timezone({
        timezone: props.timezone,
        className: styles.timezone
    })

    const childAmount = display.Amount({
        type: props.type,
        amount: props.amount
    })

    const childMembers = display.Members({
        display: 'icon',
        members,
        payer: props.payer,
        participator: props.participator,
        settled: props.settled
    })

    return (
        <>
            <Grid sm={12} justify="center" alignItems="center">
                {childIcon}
                <span className={styles.classify}>{classify.text}</span>
            </Grid>

            <Grid sm={12} justify="center" className={styles.amount}>
                {childAmount}
            </Grid>

            <Grid sm={12} justify="center" className={styles.currency}>
                {props.currency}
            </Grid>

            <Input.Label>描述</Input.Label>
            <div className={styles.content}>{props.detail}</div>

            <Input.Label>时间</Input.Label>
            <div className={styles.content}>
                {childDatetime}
                {childTimezone}
            </div>

            {members.length <= 0 ? null : (
                <Input.Label
                    description={
                        <Grid justify="flex-end">
                            <Grid
                                justify="space-around"
                                className={membersStyles['members-width']}
                            >
                                <Grid>支付</Grid>
                                <Grid>消费</Grid>
                                <Grid>还清</Grid>
                            </Grid>
                        </Grid>
                    }
                >
                    成员
                </Input.Label>
            )}
            {childMembers}
        </>
    )
}

const RecordIndex: React.FC<RouteComponentProps<IRecordIndexDeitalRouteProps> &
    IRecordIndexDeitalProps> = props => {
    const {
        history,
        match: { url },
        record
    } = props

    const { ledger } = useStore()

    const [show, setShow] = React.useState(true)

    const { data } = record

    return (
        <>
            <Popup
                show={show}
                onClose={() => {
                    setShow(false)
                }}
                onExited={() => {
                    history.replace(`/ledger/${ledger.id}`)
                }}
                className={styles.record}
                header={true}
                title="详情"
                contentPadding
            >
                {data && data.record && <Detail {...data.record} />}

                <Grid sm={12} justify="space-around" className={styles.toolbar}>
                    <Grid sm={true}>
                        <Button
                            href={`${url}/remove`}
                            title="删除"
                            type="text"
                            color="default"
                            size="medium"
                        >
                            <Icon text="trash" />
                        </Button>
                    </Grid>
                    <Grid sm="auto">
                        <Button
                            href={`${url}/edit`}
                            title="编辑"
                            type="text"
                            color="primary"
                            size="medium"
                        >
                            <Icon text="pen" /> 编辑
                        </Button>
                    </Grid>
                </Grid>
            </Popup>
        </>
    )
}

export default RecordIndex
