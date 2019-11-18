import React, { useRef } from 'react'
import { RouteComponentProps } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import middleware from '@/middleware/record'
import styles from './Index.module.scss'
import { IRecord } from '@/types/record'
import { IClassify } from '@/types/classify'

export interface IRecordIndexRouteProps {
    id: string
}

const Record: React.FC<IRecord & {
    classifies: IClassify[]
}> = (props) => {
    const { classifies, ...other } = props
    const Middleware = middleware(other, classifies)

    return (
        <>
            <Grid sm={12}>
                <Grid sm="auto">
                    <Middleware.icon />
                </Grid>
                <Grid sm={true}>
                    <Middleware.classify />
                </Grid>
                <Grid sm="auto">
                    <Middleware.datetime />
                    <Middleware.timezone />
                </Grid>
            </Grid>
            <Grid sm={12}>
                <Middleware.amount />
                <Middleware.currency />
            </Grid>
            <Grid sm={12}>成员 ________</Grid>
            <Grid sm={12}>备注 ________</Grid>
            <Grid sm={12} justify="space-around">
                <Grid sm={true}>
                    <Button color="default">
                        <Icon text="close" />
                    </Button>
                </Grid>
                <Grid sm="auto">
                    <Button color="primary">
                        <Icon text="close" /> 编辑
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

const RecordIndex: React.FC<RouteComponentProps<IRecordIndexRouteProps>> = (
    props
) => {
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
                    id
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

    const { data: dataClassifies } = useQuery<{
        classifies: IClassify[]
    }>(
        gql`
            query($pid: ID!) {
                classifies(pid: $pid) {
                    id
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
                <Grid className={styles.record} container wrap="wrap">
                    {data && data.record && (
                        <Record
                            {...data.record}
                            classifies={
                                (dataClassifies && dataClassifies.classifies) ||
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
