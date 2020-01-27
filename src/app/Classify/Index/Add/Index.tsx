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
import { useCreateClassifyForm } from '@/model/form/classify'
import { useCreateClassify } from '@/model/api/classify'
import Editor from '@/middleware/classify/Editor'

export interface IClassifyAddRouteProps {
    id: string
}
export interface IClassifyAddProps {
    onClose?: Function
    onSuccessed?: Function
}

const ClassifyAdd: React.FC<RouteComponentProps<IClassifyAddRouteProps> &
    IClassifyAddProps> = props => {
    const {
        match: {
            params: { id }
        },
        onClose,
        onSuccessed
    } = props

    const [show, setShow] = React.useState(true)

    const defaultValues = React.useMemo<IClassify>(
        () => ({
            pid: id,
            text: '',
            icon: 'image',
            color: 'grey'
        }),
        [id]
    )

    const form = useCreateClassifyForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [createMember, { loading }] = useCreateClassify({
        onError: onApolloServerError({
            ValidationError(error) {
                const {
                    extensions: { exception }
                } = error
                processorServerError.ValidationError(error)
                const errors = (exception && exception.errors) || {}
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
            title="新增分类"
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

export default ClassifyAdd
