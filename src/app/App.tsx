import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useStore } from '@/store'

import Index from './Index/Index'
import RecordEdit from './Record/Edit/Index'

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
                    <Switch>
                        <Route
                            exact
                            path="/record/:id/edit"
                            component={RecordEdit}
                        />
                        <Route component={Index} />
                    </Switch>
                </BrowserRouter>
            </useStore.Provider>
        </ApolloProvider>
    )
}

export default App
