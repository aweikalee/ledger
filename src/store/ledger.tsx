import React from 'react'

import { useStorage } from '@/utils/useStorage'
import { ILedger } from '@/model/types/ledger'

export default () => {
    /* id */
    const [id, setId] = React.useState<string | undefined>(undefined)

    const [lastId, setLastId] = useStorage<string | undefined>(
        'ledgerLastId',
        undefined
    )

    const setIdandLast: typeof setId = React.useCallback(
        value => {
            setId(value)
            setLastId(value)
        },
        [setId, setLastId]
    )

    /* data */
    const [data, setData] = React.useState<ILedger>()
    const [loading, setLoading] = React.useState(false)

    return {
        id,
        lastId,
        setId: setIdandLast,
        data,
        setData,
        loading,
        setLoading
    }
}
