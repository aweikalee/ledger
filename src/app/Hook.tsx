import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useLedger } from '@/model/api/ledger'

import { useStore } from '@/store'

const Hook: React.FC<RouteComponentProps> = props => {
    const { history } = props
    const { ledger, user } = useStore()

    /* check token */
    const { token } = user
    React.useEffect(() => {
        if (!token) {
            history.push('/login')
        }
    }, [token, history])

    /* ledger data */
    const { setData, setLoading } = ledger

    const { data, loading } = useLedger({
        variables: { id: ledger.id! },
        skip: !ledger.id,
        fetchPolicy: 'cache-and-network'
    })

    React.useEffect(() => {
        if (data && data.ledger) {
            setData(data.ledger)
        } else {
            setData(undefined)
        }
    }, [setData, data])

    React.useEffect(() => {
        setLoading(loading)
    }, [setLoading, loading])

    return <>{props.children}</>
}

export default Hook
