import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useStore } from '@/store'
import { AsyncComponent } from '@/components/AsyncComponent'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'
import MemberIndex from './Member/Index'
import UserIndex from './User/Index'

import LedgerAdd from './Ledger/Add'

import UserLogin from './User/Login'
import UserLogout from './User/Logout'

import './App.module.scss'

const Test = AsyncComponent(() =>
    import(/* webpackChunkName: 'Test' */ './Test/Index')
)

const client = new ApolloClient({
    link: new HttpLink({ uri: '/graphql' }),
    cache: new InMemoryCache()
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

                        <Route exact path="/user" component={UserIndex} />

                        <Route exact path="/login" component={UserLogin} />

                        <Route exact path="/logout" component={UserLogout} />

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
