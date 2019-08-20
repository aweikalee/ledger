import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'

import './App.module.scss'

const client = new ApolloClient({
    uri: '/graphql'
})

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={CollectionIndex} />
                    <Route exact path="/ledger/:id" component={LedgerIndex} />
                    <Route exact path="/record/:id" component={RecordIndex} />
                </Switch>
            </BrowserRouter>
        </ApolloProvider>
    )
}

export default App
