import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useStore } from '@/store'

export interface ILedgerIndexRouteProps {
    id?: string
}

const LedgerIndex: React.FC<RouteComponentProps<
    ILedgerIndexRouteProps
>> = props => {
    const {
        match: {
            params: { id }
        }
    } = props

    const store = useStore()

    React.useEffect(() => {
        store.setLastLedger(id)
    }, [id])

    return <></>
}

export default LedgerIndex
