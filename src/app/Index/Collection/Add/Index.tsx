import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import * as Input from '@/components/Input'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
import { useCreateLedger } from '@/model/api/ledger'

import useForm from './useForm'

export interface ILedgerAddRouteProps {}
export interface ILedgerAddProps {
    onClose?: Function
    onSuccessed?: Function
}

const LedgerAdd: React.FC<RouteComponentProps<ILedgerAddRouteProps> &
    ILedgerAddProps> = props => {
    const { onClose, onSuccessed } = props

    const form = useForm({
        title: ''
    })
    const { watch, getValues, setValue, handleSubmit, errors } = form

    const [createLedger] = useCreateLedger({
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
        createLedger({ variables: { data: getValues() } })
    }

    const [show, setShow] = React.useState(true)

    return (
        <Dialog
            title="新建账簿"
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
            <Input.Control error={!!errors.title}>
                <Input.Input
                    name="title"
                    id="title"
                    value={watch('title')}
                    placeholder="账簿名称"
                    onChange={e => setValue('title', e.target.value, true)}
                    clear
                />
                <Input.Helper>
                    {errors.title && errors.title.message}
                </Input.Helper>
            </Input.Control>
        </Dialog>
    )
}

export default LedgerAdd
