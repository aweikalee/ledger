import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { useStore } from '@/store'

import Apollo from './Apollo'
import Hook from './Hook'
import Index from './Index/Index'
import LedgerEdit from './Ledger/Edit/Index'
import RecordAdd from './Ledger/Add/Index'
import RecordEdit from './Record/Edit/Index'
import User from './User/Index'
import Login from './Login/Index'
import Token from './Token/Index'

import './App.module.scss'

const MainRoute: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/ledger/:id/edit" component={LedgerEdit} />
            <Route exact path="/ledger/:id/add" component={RecordAdd} />
            <Route exact path="/record/:id/edit" component={RecordEdit} />
            <Route path="/user" component={User} />
            <Route component={Index} />
        </Switch>
    )
}

const App: React.FC = () => {
    return (
        <useStore.Provider>
            <Apollo>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/token/:token" component={Token} />
                        <Route
                            render={props => (
                                <Hook {...props}>
                                    <MainRoute />
                                </Hook>
                            )}
                        />
                    </Switch>
                </BrowserRouter>
            </Apollo>
        </useStore.Provider>
    )
}

export default App
