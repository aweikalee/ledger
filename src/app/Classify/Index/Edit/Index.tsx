import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
import { IClassify } from '@/model/types/classify'
import { useUpdateClassifyForm } from '@/model/form/classify'
import { useUpdateClassify } from '@/model/api/classify'
import Editor from '@/middleware/classify/Editor'

export interface IClassifyEditRouteProps {
    id: string
}
export interface IClassifyEditProps {
    target: IClassify
    onClose?: Function
    onSuccessed?: Function
}

const ClassifyEdit: React.FC<RouteComponentProps<IClassifyEditRouteProps> &
    IClassifyEditProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const form = useUpdateClassifyForm(target)
    const { getValues, handleSubmit, setError } = form

    const [updateClassify, { loading }] = useUpdateClassify({
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
                content: '更新成功'
            })
            setShow(false)
            onSuccessed && onSuccessed()
        }
    })

    const onSubmit = () => {
        updateClassify({ variables: { data: getValues() } })
    }

    return (
        <Dialog
            title="编辑分类"
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
            <Editor form={form} loading={!target} />
        </Dialog>
    )
}

export default ClassifyEdit
