import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { onApolloError } from '@/model/error'
import { ICurrency } from '@/model/types/currency'
import { useUpdateCurrencyForm } from '@/model/form/currency'
import { useUpdateCurrency } from '@/model/api/currency'
import Editor from '@/middleware/currency/Editor'

export interface ICurrencyEditRouteProps {
    id: string
}
export interface ICurrencyEditProps {
    target: ICurrency
    onClose?: Function
    onSuccessed?: Function
}

const CurrencyEdit: React.FC<RouteComponentProps<ICurrencyEditRouteProps> &
    ICurrencyEditProps> = props => {
    const { target, onClose, onSuccessed } = props

    const [show, setShow] = React.useState(true)

    const form = useUpdateCurrencyForm(target)
    const { getValues, handleSubmit } = form

    const [updateCurrency, { loading }] = useUpdateCurrency({
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
        updateCurrency({ variables: { data: getValues() } })
    }

    return (
        <Dialog
            title="编辑货币种类"
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

export default CurrencyEdit
