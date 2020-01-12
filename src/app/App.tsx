import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useStore } from '@/store'

import MainIndex from './Main/Index'

import CollectionIndex from './Collection/Index'

import LedgerIndex from './Ledger/Index'

import './App.module.scss'

const client = new ApolloClient({
    link: new HttpLink({ uri: '/graphql' }),
    cache: new InMemoryCache()
})

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <useStore.Provider>
                <BrowserRouter>
                    <MainIndex />
                    <Switch>
                        <Route path="/collection" component={CollectionIndex} />

                        <Route
                            exact
                            path="/ledger/:id"
                            component={LedgerIndex}
                        />
                    </Switch>
                </BrowserRouter>
            </useStore.Provider>
        </ApolloProvider>
    )
}

export default App
