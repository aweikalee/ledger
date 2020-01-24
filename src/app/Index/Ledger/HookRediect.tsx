import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Loading from '@/components/Loading'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useLazyFristLedger, useCreateLedger } from '@/model/api/ledger'

const LedgerIndexHookRediect: React.FC<RouteComponentProps> = props => {
    const { history } = props

    const { ledger } = useStore()

    /**
     * 当 store.ledgerlastLId 不存在时
     * 从服务器获取当前用户按默认排序的第一个账簿
     * 重定向至该第一个账簿
     * 如果没有任何账簿 则自动创建一个
     */
    const [createLedger] = useCreateLedger({
        onError: onApolloError,
        onCompleted(data) {
            if (data && data.createLedger && data.createLedger) {
                getFrist()
            }
        }
    })
    const [getFrist] = useLazyFristLedger({
        onError: onApolloError,
        onCompleted(data: any) {
            if (data && data.firstLedger && data.firstLedger._id) {
                history.replace(`/ledger/${data.firstLedger._id}`)
            } else {
                createLedger({
                    variables: {
                        data: {
                            title: '日常'
                        }
                    }
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
