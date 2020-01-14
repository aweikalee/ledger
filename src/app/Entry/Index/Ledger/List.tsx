import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'

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
    const { datetime } = React.useContext(context)
    const [start, end] = process
        .getMonthRange(datetime)
        .map(v => timeTransform.toUTC(v))

    const store = useStore()

    const skip = React.useRef(0)

    const { data } = useRecords({
        variables: {
            pid: store.ledger.id!,
            start,
            end,
            skip: 0,
            limit: 20
        },
        skip: !store.ledger.id,
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    React.useEffect(() => {
        if (data && data.records) {
            skip.current = data.records.length
        }
    }, [data])

    return (
        <ContentBody maxWidth="sm">
            {data &&
                data.records &&
                data.records.map(item => {
                    return <Item key={item._id} {...item} />
                })}
        </ContentBody>
    )
}

export default LedgerIndexList
