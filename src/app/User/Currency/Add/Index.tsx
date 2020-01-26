import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
import { ICurrency } from '@/model/types/currency'
import { useCreateCurrencyForm } from '@/model/form/currency'
import { useCreateCurrency } from '@/model/api/currency'
import Editor from '@/middleware/currency/Editor'

export interface ICurrencyAddRouteProps {}
export interface ICurrencyAddProps {
    onClose?: Function
    onSuccessed?: Function
}

const CurrencyAdd: React.FC<RouteComponentProps<ICurrencyAddRouteProps> &
    ICurrencyAddProps> = props => {
    const { onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const defaultValues = React.useMemo<ICurrency>(
        () => ({
            name: '',
            cn: ''
        }),
        []
    )

    const form = useCreateCurrencyForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [createCurrency, { loading }] = useCreateCurrency({
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
        createCurrency({ variables: { data: getValues() } })
    }

    return (
        <Dialog
            title="新增货币种类"
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

export default CurrencyAdd
