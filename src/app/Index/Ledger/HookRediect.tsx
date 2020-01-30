import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Loading from '@/components/Loading'
import notification from '@/components/Notification'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useLazyFristLedger } from '@/model/api/ledger'

const LedgerIndexHookRediect: React.FC<RouteComponentProps> = props => {
    const { history } = props

    const { ledger } = useStore()

    const [getFrist] = useLazyFristLedger({
        fetchPolicy: 'cache-and-network',
        onError: onApolloError,
        onCompleted(data: any) {
            if (data && data.firstLedger && data.firstLedger._id) {
                history.replace(`/ledger/${data.firstLedger._id}`)
            } else {
                notification.error({
                    content: '获得账簿信息失败'
                })
            }
        }
    })

    React.useEffect(() => {
        if (ledger.lastId) {
            history.replace(`/ledger/${ledger.lastId}`)
        } else {
            getFrist()
        }
        /* eslint-disable-next-line */
    }, [])

    return <Loading show={true} delay={100} />
}

export default LedgerIndexHookRediect
