import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useUpdateLedger } from '@/model/api/ledger'
import { ILedger, IUpdateLedger } from '@/model/types/ledger'

export interface ILedgerRemoveRouteProps {}
export interface ILedgerRemoveProps {
    target: ILedger
    onClose?: Function
    onSuccessed?: Function
}

const LedgerRemove: React.FC<RouteComponentProps<ILedgerRemoveRouteProps> &
    ILedgerRemoveProps> = props => {
    const { target, onClose, onSuccessed } = props

    const store = useStore()
    const [show, setShow] = React.useState(true)

    const [updateLedger, { loading }] = useUpdateLedger({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '删除成功'
            })

            if (target._id === store.ledger.id) {
                store.ledger.setId(undefined)
            }

            setShow(false)
            onSuccessed && onSuccessed()
        }
    })
    const onSubmit = () => {
        if (!target._id) {
            notification.error({
                content: 'id不存在'
            })
            return
        }

        const _data: IUpdateLedger = {
            _id: target._id,
            deleted: true
        }
        updateLedger({ variables: { data: _data } })
    }

    return (
        <Dialog
            title="删除确认"
            show={show}
            onConfirm={onSubmit}
            confirmDisabled={loading}
            confirmText={
                loading ? (
                    <PointSpinner style={{ fontSize: '0.8em' }} />
                ) : (
                    undefined
                )
            }
            onClose={() => {
                setShow(false)
            }}
            onExited={() => {
                onClose && onClose()
            }}
        >
            确认要删除“{target.title}”吗？
        </Dialog>
    )
}

export default LedgerRemove
