import React from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useStore } from '@/store'

import './App.module.scss'

const Apollo: React.FC = ({ children }) => {
    const { user } = useStore()
    const { token } = user

    const link = React.useMemo(() => {
        return new HttpLink({
            uri: '/graphql',
            headers: {
                authorization: token || ''
            }
        })
    }, [token])

    const cache = React.useMemo(() => {
        return new InMemoryCache()
    }, [])

    const client = React.useMemo(() => {
        return new ApolloClient({
            link,
            cache
        })
    }, [link, cache])

    return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default Apollo
