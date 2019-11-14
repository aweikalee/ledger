import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useStore } from '@/store'
import { AsyncComponent } from '@/components/AsyncComponent'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'
import MemberIndex from './Member/Index'

import LedgerAdd from './Ledger/Add'

import './App.module.scss'

const Test = AsyncComponent(() =>
    import(/* webpackChunkName: 'Test' */ './Test/Index')
)

const client = new ApolloClient({
    uri: '/graphql'
})

const App: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <useStore.Provider>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={CollectionIndex} />
                        <Route
                            exact
                            path="/ledger/:id"
                            component={LedgerIndex}
                        />
                        <Route
                            exact
                            path="/record/:id"
                            component={RecordIndex}
                        />

                        <Route
                            exact
                            path="/ledger/:id/add"
                            component={LedgerAdd}
                        />

                        <Route
                            exact
                            path="/member/:id"
                            component={MemberIndex}
                        />

                        {process.env.NODE_ENV === 'development' && (
                            <Route exact path="/test" component={Test} />
                        )}
                    </Switch>
                </BrowserRouter>
            </useStore.Provider>
        </ApolloProvider>
    )
}

export default App
