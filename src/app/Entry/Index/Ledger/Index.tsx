import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import { useStore } from '@/store'

import List from './List'
import Hook from './Hook'
import HookRediect from './HookRediect'

const LedgerIndex: React.FC<RouteComponentProps> = props => {
    const store = useStore()

    return (
        <>
            <Route
                render={props =>
                    !store.ledger.id ? null : <List {...props} />
                }
            />

            <Switch>
                <Route exact path="/" component={HookRediect} />
                <Route exact path="/ledger" component={HookRediect} />
                <Route exact path="/ledger/:id" component={Hook} />
            </Switch>
        </>
    )
}

export default LedgerIndex
