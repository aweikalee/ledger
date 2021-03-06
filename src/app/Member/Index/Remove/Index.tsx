import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { onApolloError } from '@/model/error'
import { IMember, IUpdateMember } from '@/model/types/member'
import { useUpdateMember } from '@/model/api/member'

export interface IMemberRemoveRouteProps {
    id: string
}
export interface IMemberRemoveProps {
    target: IMember
    onClose?: Function
    onSuccessed?: Function
}

const MemberRemove: React.FC<RouteComponentProps<IMemberRemoveRouteProps> &
    IMemberRemoveProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const [updateMember, { loading }] = useUpdateMember({
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

        const _data: IUpdateMember = {
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
            确认要删除“{target.name}”吗？
        </Dialog>
    )
}

export default MemberRemove
