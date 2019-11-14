import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { TransitionGroup } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import { DelayCSSTransition } from '@/components/Animation'
import * as Loading from '@/components/Loading'
import { ILoadMoreProps } from '@/components/Loading/More'
import Record, { IRecord, IClassify } from './components/Record'
import styles from './Index.module.scss'
import { format } from 'date-fns'
import config from '@/config'

export interface ILedgerIndexRouteProps {
    id: string
}

const LedgerIndex: React.FC<
    RouteComponentProps<ILedgerIndexRouteProps>
> = props => {
    const {
        match: {
            params: { id }
        }
    } = props
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
                        classify
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

    const classnamesItem: CSSTransitionClassNames = {
        enter: styles['item-enter'],
        enterActive: styles['item-enter-active'],
        exit: styles['item-exit'],
        exitActive: styles['item-exit-active']
    }
    const types = (dataClassifies && dataClassifies.classifies) || []
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
                            const type = getType(item.classify)
                            const delay = (index % 10) * 100 // 10为一页的数量，records请求中的limit
                            return (
                                <DelayCSSTransition
                                    timeout={400}
                                    enterDelay={delay}
                                    exitDelay={0}
                                    classNames={classnamesItem}
                                    key={item.id}
                                >
                                    <Record {...item} classifyData={type} />
                                </DelayCSSTransition>
                            )
                        })}
                </TransitionGroup>
                <Loading.More
                    handler={fetchMoreFn}
                    loading={loading}
                    delay={100}
                />
            </ContentBody>
            <ToolBar
                active={{
                    main: true
                }}
                href={{
                    main: `/ledger/${id}/add`
                }}
            />
        </>
    )
}

export default LedgerIndex
