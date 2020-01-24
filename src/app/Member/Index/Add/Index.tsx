import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
import { IMember } from '@/model/types/member'
import { useCreateMemberForm } from '@/model/form/member'
import { useCreateMember } from '@/model/api/member'
import Editor from '@/middleware/member/Editor'

export interface IMemberAddRouteProps {
    id: string
}
export interface IMemberAddProps {
    onClose?: Function
    onSuccessed?: Function
}

const MemberAdd: React.FC<RouteComponentProps<IMemberAddRouteProps> &
    IMemberAddProps> = props => {
    const {
        match: {
            params: { id }
        },
        onClose,
        onSuccessed
    } = props

    const [show, setShow] = React.useState(true)

    const defaultValues = React.useMemo<IMember>(
        () => ({
            pid: id,
            name: ''
        }),
        [id]
    )

    const form = useCreateMemberForm(defaultValues)
    const { getValues, handleSubmit } = form

    const [createMember] = useCreateMember({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '创建成功'
            })
            setShow(false)
            onSuccessed && onSuccessed()
        }
    })

    const onSubmit = () => {
        createMember({ variables: { data: getValues() } })
    }

    return (
        <Dialog
            title="新增成员"
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
            <Editor form={form} loading={false} />
        </Dialog>
    )
}

export default MemberAdd
