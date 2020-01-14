import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'

import { useStore } from '@/store'
import { timeTransform } from '@/utils/timeZone'
import { onApolloError } from '@/model/error'
import { useRecords } from '@/model/api/record'
import * as process from '@/middleware/record/process'

import Item from './Item'

const LedgerIndexList: React.FC<RouteComponentProps> = props => {
    const store = useStore()

    const [datetime] = React.useState(() => {
        const [start, end] = process.getMonthRange(Date.now())
        return {
            start: timeTransform.toUTC(start),
            end: timeTransform.toUTC(end)
        }
    })

    const skip = React.useRef(0)

    const { data } = useRecords({
        variables: {
            pid: store.ledger.id!,
            start: datetime.start,
            end: datetime.end,
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
