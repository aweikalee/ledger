import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
import { IMember } from '@/model/types/member'
import { useUpdateMemberForm } from '@/model/form/member'
import { useUpdateMember } from '@/model/api/member'
import Editor from '@/middleware/member/Editor'

export interface IMemberEditRouteProps {
    id: string
}
export interface IMemberEditProps {
    target: IMember
    onClose?: Function
    onSuccessed?: Function
}

const MemberEdit: React.FC<RouteComponentProps<IMemberEditRouteProps> &
    IMemberEditProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const form = useUpdateMemberForm(target)
    const { getValues, handleSubmit } = form

    const [updateMember] = useUpdateMember({
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
        updateMember({ variables: { data: getValues() } })
    }

    return (
        <Dialog
            title="编辑成员"
            show={show}
            onConfirm={handleSubmit(onSubmit)}
            onClose={() => {
                setShow(false)
            }}
            onClickOverlay={() => {}}
            onExited={() => {
                onClose && onClose()
            }}
        >
            <Editor form={form} loading={!!target} />
        </Dialog>
    )
}

export default MemberEdit
