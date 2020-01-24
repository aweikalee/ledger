import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { onApolloError } from '@/model/error'
import { IClassify, IUpdateClassify } from '@/model/types/classify'
import { useUpdateClassify } from '@/model/api/classify'

export interface IClassifyRemoveRouteProps {
    id: string
}
export interface IClassifyRemoveProps {
    target: IClassify
    onClose?: Function
    onSuccessed?: Function
}

const ClassifyRemove: React.FC<RouteComponentProps<IClassifyRemoveRouteProps> &
    IClassifyRemoveProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const [updateMember, { loading }] = useUpdateClassify({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '更新成功'
            })
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

        const _data: IUpdateClassify = {
            _id: target._id,
            deleted: true
        }
        updateMember({ variables: { data: _data } })
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
            确认要删除“{target.text}”吗？
        </Dialog>
    )
}

export default ClassifyRemove
