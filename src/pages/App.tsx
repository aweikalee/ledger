import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'

import './App.module.scss'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={CollectionIndex} />
                <Route exact path="/ledger/:id" component={LedgerIndex} />
                <Route exact path="/record/:id" component={RecordIndex} />
            </Switch>
        </BrowserRouter>
    )
}

export default App
