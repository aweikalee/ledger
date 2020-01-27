import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import { useStore } from '@/store'

import List from './List'
import Hook from './Hook'
import HookRediect from './HookRediect'

export interface ILedgerIndexProps {}

const LedgerIndex: React.FC<RouteComponentProps &
    ILedgerIndexProps> = props => {
    const { ledger } = useStore()

    return (
        <>
            <Route component={ledger.data ? List : undefined} />

            <Switch>
                <Route exact path="/ledger" component={HookRediect} />
                <Route exact path="/ledger/:id" component={Hook} />
                <Route path="/collection" />
                <Route path="/record" />
                <Route component={HookRediect} />
            </Switch>
        </>
    )
}

export default LedgerIndex
