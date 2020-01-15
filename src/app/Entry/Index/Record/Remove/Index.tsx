import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useUpdateRecord } from '@/model/api/record'
import { IUpdateRecord } from '@/model/types/record'

import context from '../context'

export interface IRecordRemoveRouteProps {}
export interface IRecordRemoveProps {
    onClose?: Function
    onSuccessed?: Function
}

const RecordRemove: React.FC<RouteComponentProps<IRecordRemoveRouteProps> &
    IRecordRemoveProps> = props => {
    const { onClose, onSuccessed } = props
    const {
        ledger: { pushDeleted }
    } = useStore()

    const [show, setShow] = React.useState(true)

    const record = React.useContext(context).record
    const data = (record && record.data && record.data.record) || {}

    const [updateRecord] = useUpdateRecord({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '删除成功'
            })
            pushDeleted(data._id!)

            setShow(false)
            onSuccessed && onSuccessed()
        }
    })
    const onSubmit = () => {
        if (!data._id) {
            notification.error({
                content: 'id不存在'
            })
            return
        }

        const _data: IUpdateRecord = {
            _id: data._id,
            deleted: true
        }
        updateRecord({ variables: { data: _data } })
    }

    return (
        <Dialog
            title="删除确认"
            show={show}
            onConfirm={onSubmit}
            onClose={() => {
                setShow(false)
            }}
            onExited={() => {
                onClose && onClose()
            }}
        >
            确认要删除“{data._id}”吗？
        </Dialog>
    )
}

export default RecordRemove
