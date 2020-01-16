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

    const { id: ledgerId, setId } = ledger

    React.useEffect(() => {
        if (id !== ledgerId) {
            setId(id)
        }
    }, [id, ledgerId, setId])

    return null
}

export default LedgerIndexHook
