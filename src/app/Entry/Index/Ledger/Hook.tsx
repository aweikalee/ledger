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

    const { ledger } = useStore()

    React.useEffect(() => {
        if (id !== ledger.id) {
            ledger.setId(id)
        }
    }, [id, ledger.id, ledger.setId])

    return null
}

export default LedgerIndexHook
