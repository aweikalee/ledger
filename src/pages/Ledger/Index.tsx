import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { TransitionGroup } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import { DelayCSSTransition } from '@/components/Animation'
import { LoadMore } from '@/components/Loading'
import Record, { IRecord, IRecordType } from './components/Record'
import styles from './Index.module.scss'
import { format } from 'date-fns'
import config from '@/config'
import { ILoadMoreProps } from '@/components/Loading/LoadMore'

const LedgerIndex: React.FC = props => {
    const {
        params: { id }
    } = (props as any).match as {
        params: {
            id: string
        }
    }

    const [cursor, setCursor] = useState('')

    const [date] = useState(format(new Date(), config.datetimeFormat))
    useEffect(() => {})

    /* Records */
    const { loading, fetchMore, data } = useQuery<{
        records: {
            next: string
            content: IRecord[]
            __typename: string
        }
    }>(
        gql`
            query($pid: ID!, $date: String, $cursor: ID) {
                records(pid: $pid, date: $date, cursor: $cursor, limit: 10) {
                    next
                    content {
                        id
                        type
                        timezone
                        datetime
                        detail
                        amount
                        currency
                    }
                }
            }
        `,
        {
            variables: {
                pid: id,
                date
            }
        }
    )

    useEffect(() => {
        if (data && data.records && data.records.next) {
            setCursor(data.records.next)
        }
    }, [data])

    const fetchMoreFn: ILoadMoreProps['handler'] = cb => {
        if (loading) {
            return
        }
        fetchMore({
            variables: {
                pid: id,
                date,
                cursor
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (fetchMoreResult) {
                    const records = fetchMoreResult.records
                    return {
                        records: {
                            next: fetchMoreResult.records.next,
                            content: [
                                ...prev.records.content,
                                ...records.content
                            ],
                            __typename: records.__typename
                        }
                    }
                } else {
                    return prev
                }
            }
        }).then(res => {
            if (res.errors) {
                cb(res.errors[0])
            } else {
                cb(null, !res.data.records.next)
            }
        })
    }

    /* Types */
    const { data: dataTypes } = useQuery<{
        recordTypes: IRecordType[]
    }>(
        gql`
            query($pid: ID!) {
                recordTypes(pid: $pid) {
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

    const classnamesItem: CSSTransitionClassNames = {
        enter: styles['item-enter'],
        enterActive: styles['item-enter-active'],
        exit: styles['item-exit'],
        exitActive: styles['item-exit-active']
    }
    const types = (dataTypes && dataTypes.recordTypes) || []
    const getType = (id: string) => {
        return (
            types.find(v => v.id === id) || {
                id: '',
                text: '未分类',
                icon: 'image',
                color: 'grey'
            }
        )
    }

    return (
        <>
            <NavigationBar
                title="旅行账簿"
                subTitle="2019-08-13"
                left={<BackButton text="账簿盒" href="/" />}
            />
            <ContentBody maxWidth="sm">
                <TransitionGroup component={Grid} container direction="column">
                    {data &&
                        data.records &&
                        (data.records.content || []).map((item, index) => {
                            const type = getType(item.type)
                            return (
                                <DelayCSSTransition
                                    timeout={400}
                                    enterDelay={index * 100}
                                    exitDelay={0}
                                    classNames={classnamesItem}
                                    key={item.id}
                                >
                                    <Record {...item} recordType={type} />
                                </DelayCSSTransition>
                            )
                        })}
                </TransitionGroup>
                <LoadMore handler={fetchMoreFn} />
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerIndex
