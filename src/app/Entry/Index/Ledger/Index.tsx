import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import { useStore } from '@/store'

import LedgerIndexList from './List'
import LedgerIndexHook from './Hook'

const LedgerIndex: React.FC<RouteComponentProps> = props => {
    const store = useStore()

    return (
        <>
            <Route
                render={props =>
                    !store.lastLedger ? null : <LedgerIndexList {...props} />
                }
            />
            <Route exact path="/ledger/:id" component={LedgerIndexHook} />
        </>
    )
}

export default LedgerIndex
