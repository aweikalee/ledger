import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useRecords } from '@/model/api/record'

import Item from './Item'

const LedgerIndexList: React.FC<RouteComponentProps> = props => {
    const store = useStore()

    const { loading, fetchMore, data } = useRecords({
        variables: {
            pid: store.lastLedger || '0',
            start: 0,
            end: 0,
            skip: 0,
            limit: 20
        },
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    return <ContentBody></ContentBody>
}

export default LedgerIndexList
