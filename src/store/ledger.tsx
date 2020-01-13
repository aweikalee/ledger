import React from 'react'

import { useStorage } from '@/utils/useStorage'
import { useLedger } from '@/model/api/ledger'

export default () => {
    const [id, setId] = React.useState<string | undefined>(undefined)

    const [lastId, setLastId] = useStorage<string | undefined>(
        'ledgerLastId',
        undefined
    )

    const { data: ledger, error, loading } = useLedger({
        variables: { id: id! },
        skip: !id
    })
    const data = ledger && ledger.ledger

    React.useEffect(() => {
        setLastId(id)
    }, [id, setLastId])

    return { id, lastId, setId, data, error, loading }
}
