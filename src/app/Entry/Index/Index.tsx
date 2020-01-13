import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useLedger } from '@/model/api/ledger'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'

const MainIndex: React.FC<RouteComponentProps> = props => {
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
    }, [ledger, store])

    return (
        <>
            <NavigationBar
                left={
                    <Button type="text" color="default" href="/collection">
                        {(ledger && ledger.ledger && ledger.ledger.title) || ''}
                    </Button>
                }
            />

            <ContentBody maxWidth="sm">
                <Route component={LedgerIndex} />
            </ContentBody>

            <ToolBar
                active={{ main: true }}
                href={{ main: `/ledger/${_id}/add` }}
            />

            <Route path="/collection" component={CollectionIndex} />
        </>
    )
}

export default MainIndex
