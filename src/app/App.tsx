import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { useStore } from '@/store'

import history from './history'
import Apollo from './Apollo'
import Hook from './Hook'
import Index from './Index/Index'
import LedgerEdit from './Ledger/Edit/Index'
import RecordAdd from './Ledger/Add/Index'
import RecordEdit from './Record/Edit/Index'
import Member from './Member/Index'
import Classify from './Classify/Index'
import User from './User/Index'
import Login from './Login/Index'
import Token from './Token/Index'
import NotFound from './NotFound/Index'

import './App.module.scss'

const MainRoute: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/404" component={NotFound} />
            <Route exact path="/ledger/:id/edit" component={LedgerEdit} />
            <Route exact path="/ledger/:id/add" component={RecordAdd} />
            <Route exact path="/record/:id/edit" component={RecordEdit} />
            <Route path="/member" component={Member} />
            <Route path="/classify" component={Classify} />
            <Route path="/user" component={User} />
            <Route component={Index} />
        </Switch>
    )
}

const App: React.FC = () => {
    return (
        <useStore.Provider>
            <Apollo>
                <Router history={history}>
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
                </Router>
            </Apollo>
        </useStore.Provider>
    )
}

export default App
