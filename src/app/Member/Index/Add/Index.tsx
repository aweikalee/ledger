import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
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
    const { getValues, handleSubmit, setError } = form

    const [createMember, { loading }] = useCreateMember({
        onError: onApolloServerError({
            ValidationError(extensions) {
                processorServerError.ValidationError(extensions)
                const errors = extensions.exception.errors || {}
                for (const path in errors) {
                    const { message } = errors[path]
                    setError(path as any, '', message)
                }
            }
        }),
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
