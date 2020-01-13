import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import { useStore } from '@/store'

import LedgerIndexHook from './Hook'

export interface ILedgerIndexRouteProps {
    id?: string
}

const LedgerIndex: React.FC<RouteComponentProps<
    ILedgerIndexRouteProps
>> = props => {
    const store = useStore()

    return (
        <>
            <Route exact path="/ledger/:id" component={LedgerIndexHook} />
        </>
    )
}

export default LedgerIndex
