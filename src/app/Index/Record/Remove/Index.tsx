import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { onApolloError } from '@/model/error'
import { useUpdateRecord } from '@/model/api/record'
import { IUpdateRecord } from '@/model/types/record'

import recordContext from '../context'
import indexContext from '../../context'

export interface IRecordRemoveRouteProps {}
export interface IRecordRemoveProps {
    onClose?: Function
    onSuccessed?: Function
}

const RecordRemove: React.FC<RouteComponentProps<IRecordRemoveRouteProps> &
    IRecordRemoveProps> = props => {
    const { onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const { pushDeleted } = React.useContext(indexContext)

    const record = React.useContext(recordContext).record
    const data = (record && record.data && record.data.record) || {}

    const [updateRecord, { loading }] = useUpdateRecord({
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
            确认要删除“{data._id}”吗？
        </Dialog>
    )
}

export default RecordRemove
