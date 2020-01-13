import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useStore } from '@/store'

export interface ILedgerIndexHookRouteProps {
    id?: string
}

const LedgerIndexHook: React.FC<RouteComponentProps<
    ILedgerIndexHookRouteProps
>> = props => {
    const {
        match: {
            params: { id }
        }
    } = props

    const store = useStore()

    React.useEffect(() => {
        store.setLastLedger(id)
    }, [id, store])

    return <></>
}

export default LedgerIndexHook
