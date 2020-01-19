import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
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
    const { getValues, handleSubmit } = form

    const [createMember] = useCreateClassify({
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
            title="新增分类"
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
            <Editor form={form} />
        </Dialog>
    )
}

export default ClassifyAdd
