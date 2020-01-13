import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useStore } from '@/store'
import { useLazyFristLedger } from '@/model/api/ledger'

const LedgerIndexHookRediect: React.FC<RouteComponentProps> = props => {
    const { history } = props

    const { ledger } = useStore()

    /**
     * 当 store.ledgerlastLId 不存在时
     * 从服务器获取当前用户按默认排序的第一个账簿
     * 重定向至该第一个账簿
     */
    const [getFrist] = useLazyFristLedger({
        onCompleted(data: any) {
            if (data && data.firstLedger && data.firstLedger._id) {
                history.replace(`/ledger/${data.firstLedger._id}`)
            }
        }
    })

    React.useEffect(() => {
        if (ledger.lastId) {
            history.replace(`/ledger/${ledger.lastId}`)
        } else {
            getFrist()
        }
    }, [])

    return null
}

export default LedgerIndexHookRediect
