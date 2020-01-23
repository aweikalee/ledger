import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ApolloError } from 'apollo-boost'

import ContentBody from '@/components/ContentBody'
import More from '@/components/Loading/More'

import config from '@/config'
import { useStore } from '@/store'
import { timeTransform } from '@/utils/timeZone'
import { onApolloError } from '@/model/error'
import { useRecords } from '@/model/api/record'
import * as process from '@/middleware/record/process'

import context from '../context'
import Item from './Item'

export interface ILedgerIndexProps {}

const LedgerIndexList: React.FC<RouteComponentProps &
    ILedgerIndexProps> = props => {
    const { ledger } = useStore()

    /* 参数 */
    const { datetime } = React.useContext(context)
    const [start, end] = process
        .getMonthRange(datetime)
        .map(v => timeTransform.toUTC(v))
    const skip = React.useRef(0)

    /* 状态 */
    const [loading, setLoading] = React.useState(true)
    const [complete, setComplete] = React.useState(false)
    const [error, setError] = React.useState(false)

    /* 错误 */
    const onError: (err: Error) => void = err => {
        setLoading(false)
        setError(true)
        if (err instanceof ApolloError) {
            onApolloError(err)
        }
    }

    /* 重置状态 */
    React.useEffect(() => {
        skip.current = 0
        setLoading(true)
        setComplete(false)
        setError(false)
    }, [ledger.id])

    const { data, fetchMore } = useRecords({
        variables: {
            pid: ledger.id!,
            start,
            end,
            skip: 0,
            limit: config.listLimit
        },
        skip: !ledger.id,
        onError,
        fetchPolicy: 'cache-and-network',
        onCompleted() {
            setLoading(false)
        }
    })

    /* 更新skip */
    React.useEffect(() => {
        if (data && data.records) {
            skip.current = data.records.length
        }
    }, [data])

    /* fetchMore */
    const fetchMorelFn = () => {
        setLoading(true)

        fetchMore({
            variables: {
                skip: skip.current
            },
            updateQuery(prev, { fetchMoreResult }) {
                if (fetchMoreResult && fetchMoreResult.records) {
                    const records = fetchMoreResult.records
                    if (records.length > 0) {
                        return {
                            ...prev,
                            records: [
                                ...((prev && prev.records) || []),
                                ...(records || [])
                            ]
                        }
                    } else {
                        setComplete(true)
                    }
                }
                return prev
            }
        }).catch(onError)
    }

    return (
        <ContentBody maxWidth="sm">
            {data &&
                data.records &&
                data.records.map(item => {
                    return <Item key={item._id} {...item} />
                })}
            <More
                loading={loading}
                complete={complete}
                error={error}
                delay={100}
                handler={fetchMorelFn}
            />
        </ContentBody>
    )
}

export default LedgerIndexList
