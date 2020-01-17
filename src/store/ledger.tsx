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

    React.useEffect(() => {
        setLastId(id)
    }, [id, setLastId])

    const [data, setData] = React.useState<ILedger>()

    return {
        id,
        lastId,
        setId,
        data,
        setData
    }
}
