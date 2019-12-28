import React, { useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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

import { IRecord } from '@/types/record'
import { IClassify } from '@/types/classify'

import styles from './Index.module.scss'
import membersStyles from './components/Members.module.scss'

export interface IMember {
    id: string
    name: string
}

export interface IRecordIndexRouteProps {
    id: string
}

const Record: React.FC<IRecord & {
    classifies: IClassify[]
    members: IMember[]
}> = props => {
    const { classifies, members, ...other } = props
    const Middleware = middleware(other, classifies)

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
                    members={memberMiddleware(other, members)}
                />
            </Grid>

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

    const { data } = useQuery<{
        record: IRecord
    }>(
        gql`
            query($id: ID!) {
                record(id: $id) {
                    _id
                    type
                    classify
                    timezone
                    datetime
                    detail
                    amount
                    currency
                    payer
                    participator
                    settled
                }
            }
        `,
        {
            variables: {
                id: id
            }
        }
    )

    /* Classify */
    const { data: dataClassifies } = useQuery<{
        classifies: IClassify[]
    }>(
        gql`
            query($pid: ID!) {
                classifies(pid: $pid) {
                    _id
                    text
                    icon
                    color
                }
            }
        `,
        {
            variables: {
                pid: id
            }
        }
    )

    /* Member */
    const { data: dataMember } = useQuery<{
        members: IMember[]
    }>(
        gql`
            query($id: ID!) {
                members(pid: $id) {
                    _id
                    name
                }
            }
        `,
        {
            variables: {
                id: id
            }
        }
    )

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
                left={<BackButton href="/ledger/1" text="账簿" />}
            />
            <ContentBody>
                <Grid className={styles.record} wrap="wrap">
                    {data && data.record && (
                        <Record
                            {...data.record}
                            classifies={
                                (dataClassifies && dataClassifies.classifies) ||
                                []
                            }
                            members={(dataMember && dataMember.members) || []}
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
