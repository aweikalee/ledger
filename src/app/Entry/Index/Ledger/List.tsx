import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'
import More, { IStatus } from '@/components/Loading/More'

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
    const [status, setStatus] = React.useState<IStatus>('ready')
    const [loading, setLoading] = React.useState(true)

    const { ledger } = useStore()

    const { datetime } = React.useContext(context)
    const [start, end] = process
        .getMonthRange(datetime)
        .map(v => timeTransform.toUTC(v))

    const skip = React.useRef(0)

    const { data, fetchMore } = useRecords({
        variables: {
            pid: ledger.id!,
            start,
            end,
            skip: 0,
            limit: config.listLimit
        },
        skip: !ledger.id,
        onError(err) {
            setLoading(false)
            setStatus('error')
            onApolloError(err)
        },
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            setLoading(false)
            if (data.records && data.records.length === skip.current) {
                setStatus('complete')
            }
        }
    })

    React.useEffect(() => {
        if (data && data.records) {
            skip.current = data.records.length
        }
    }, [data])

    React.useEffect(() => {
        skip.current = 0
        setStatus('ready')
    }, [ledger.id])

    const fetchMorelFn = () => {
        setLoading(true)

        fetchMore({
            variables: {
                skip: skip.current
            },
            updateQuery(prev, { fetchMoreResult }) {
                if (fetchMoreResult) {
                    const records = fetchMoreResult.records
                    return {
                        ...prev,
                        records: [...(prev.records || []), ...(records || [])]
                    }
                } else {
                    return prev
                }
            }
        })
    }

    return (
        <ContentBody maxWidth="sm">
            {data &&
                data.records &&
                data.records.map(item => {
                    return <Item key={item._id} {...item} />
                })}
            <More
                status={status}
                loading={loading}
                delay={100}
                handler={fetchMorelFn}
            />
        </ContentBody>
    )
}

export default LedgerIndexList
