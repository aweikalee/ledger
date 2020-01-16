import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import { useStore } from '@/store'

import List from './List'
import Hook from './Hook'
import HookRediect from './HookRediect'

export interface ILedgerIndexProps {}

const LedgerIndex: React.FC<RouteComponentProps &
    ILedgerIndexProps> = props => {
    const store = useStore()

    return (
        <>
            <Route component={store.ledger.id ? List : undefined} />

            <Switch>
                <Route exact path="/" component={HookRediect} />
                <Route exact path="/ledger" component={HookRediect} />
                <Route exact path="/ledger/:id" component={Hook} />
            </Switch>
        </>
    )
}

export default LedgerIndex
