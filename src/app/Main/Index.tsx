import React from 'react'

import NavigationBar from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { timeTransform } from '@/utils/timeZone'
import { useLedger } from '@/model/api/ledger'

import styles from './Index.module.scss'

export interface ILedgerIndexProps {
    id?: string
}

const LedgerIndex: React.FC<ILedgerIndexProps> = props => {
    const {} = props

    const store = useStore()

    const _id = store.lastLedger

    const { data: ledger } = useLedger({
        variables: { id: _id },
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    React.useEffect(() => {
        if (ledger && ledger.ledger && ledger.ledger._id) {
            store.setLastLedger(ledger.ledger._id)
        }
    }, [ledger])

    return (
        <>
            <NavigationBar
                left={
                    <Button type="text" color="default" href="/collection">
                        {(ledger && ledger.ledger && ledger.ledger.title) || ''}
                    </Button>
                }
            />
            <ContentBody maxWidth="sm"></ContentBody>
            <ToolBar
                active={{
                    main: true
                }}
                href={{
                    main: `/ledger/${_id}/add`
                }}
            />
        </>
    )
}

export default LedgerIndex

function getDateTime(now: number) {
    return {
        local: now,
        utc: timeTransform.toUTC(now)
    }
}
