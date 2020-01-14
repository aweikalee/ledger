import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
import { useUpdateRecord } from '@/model/api/record'
import { IRecord, IUpdateRecord } from '@/model/types/record'

export interface IRecordRemoveRouteProps {}
export interface IRecordRemoveProps {
    target: IRecord
    onClose?: Function
    onSuccessed?: Function
}

const RecordRemove: React.FC<RouteComponentProps<IRecordRemoveRouteProps> &
    IRecordRemoveProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const [updateRecord] = useUpdateRecord({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '删除成功'
            })

            onSuccessed && onSuccessed()
            setShow(false)
        }
    })
    const onSubmit = () => {
        if (!target._id) {
            notification.error({
                content: 'id不存在'
            })
            return
        }

        const _data: IUpdateRecord = {
            _id: target._id,
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
            确认要删除“{target._id}”吗？
        </Dialog>
    )
}

export default RecordRemove