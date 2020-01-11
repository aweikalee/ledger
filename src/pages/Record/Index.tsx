import React, { useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Dialog from '@/components/Dialog'
import * as Input from '@/components/Input'
import Members from './components/Members'

import middleware from '@/middleware/record/record'
import memberMiddleware from '@/middleware/record/member'

import { IRecord } from '@/model/types/record'
import { ILedger } from '@/model/types/ledger'
import { useRecord } from '@/model/api/record'
import { useLedger } from '@/model/api/ledger'

import styles from './Index.module.scss'
import membersStyles from './components/Members.module.scss'

export interface IRecordIndexRouteProps {
    id: string
}

const Record: React.FC<IRecord & {
    classifies: ILedger['classifies']
    members: ILedger['members']
}> = props => {
    const { classifies, members, ...other } = props
    const Middleware = middleware(other, classifies || [])

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <>
            <Grid sm={12} justify="center" alignItems="center">
                <Middleware.icon className={styles.icon} />
                <Middleware.classify className={styles.classify} />
            </Grid>

            <Grid sm={12} justify="center" className={styles.amount}>
                <Middleware.amount />
            </Grid>

            <Grid sm={12} justify="center" className={styles.currency}>
                <Middleware.currency />
            </Grid>

            <Input.Label>描述</Input.Label>
            <div className={styles.content}>
                <Middleware.detail />
            </div>

            <Input.Label>时间</Input.Label>
            <div className={styles.content}>
                <Middleware.datetime />
                <Middleware.timezone className={styles.timezone} />
            </div>

            {members && members.length > 0 && (
                <Grid sm={12}>
                    <Input.Label
                        description={
                            <Grid justify="flex-end">
                                <Grid
                                    className={membersStyles.width}
                                    justify="space-around"
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

                    <Members
                        display="icon"
                        members={memberMiddleware(other, members || [])}
                    />
                </Grid>
            )}

            <Grid sm={12} justify="space-around" className={styles.toolbar}>
                <Grid sm={true}>
                    <Button
                        color="default"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Icon text="trash" />
                    </Button>
                </Grid>
                <Grid sm="auto">
                    <Button color="primary" href={`/record/${props._id}/edit`}>
                        <Icon text="pen" /> 编辑
                    </Button>
                </Grid>
            </Grid>

            {/* 删除确认 */}
            <Dialog
                show={showDeleteDialog}
                onConfirm={() => setShowDeleteDialog(false)}
                onClose={() => setShowDeleteDialog(false)}
            >
                确定要删除这条记录吗？
            </Dialog>
        </>
    )
}

const RecordIndex: React.FC<RouteComponentProps<
    IRecordIndexRouteProps
>> = props => {
    const {
        match: {
            params: { id }
        }
    } = props

    const { data } = useRecord({
        variables: {
            id: id
        }
    })

    const { data: ledger } = useLedger({
        variables: {
            id: (data && data.record && data.record.pid) || ''
        },
        skip: !(data && data.record)
    })

    const refMask = useRef(null)

    const onMaskClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.target === refMask.current) {
            props.history.goBack()
        }
    }

    return (
        <>
            <NavigationBar
                title="详情"
                left={
                    (data && data.record && (
                        <BackButton
                            href={`/ledger/${data.record.pid}`}
                            text="账簿"
                        />
                    )) || (
                        <BackButton
                            onClick={() => props.history.goBack()}
                            text="账簿"
                        />
                    )
                }
            />
            <ContentBody>
                <Grid className={styles.record} wrap="wrap">
                    {data && data.record && (
                        <Record
                            {...data.record}
                            classifies={
                                (ledger &&
                                    ledger.ledger &&
                                    ledger.ledger.classifies) ||
                                []
                            }
                            members={
                                (ledger &&
                                    ledger.ledger &&
                                    ledger.ledger.members) ||
                                []
                            }
                        />
                    )}
                </Grid>
            </ContentBody>
            <div ref={refMask} className={styles.mask} onClick={onMaskClick} />
            <ToolBar
                active={{
                    main: true
                }}
                href={{
                    main: `/ledger/:id/add`
                }}
            />
        </>
    )
}

export default RecordIndex
