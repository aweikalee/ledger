import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import Grid from '@/components/Grid'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
import { useCreateLedger } from '@/model/api/ledger'
import { useCreateLedgerForm } from '@/model/form/ledger'
import Editor from '@/middleware/ledger/Editor'

export interface ILedgerAddRouteProps {}
export interface ILedgerAddProps {
    onClose?: Function
    onSuccessed?: Function
}

const LedgerAdd: React.FC<RouteComponentProps<ILedgerAddRouteProps> &
    ILedgerAddProps> = props => {
    const { onClose, onSuccessed } = props

    const defaultValues = React.useMemo(
        () => ({
            title: ''
        }),
        []
    )
    const form = useCreateLedgerForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [createLedger, { loading }] = useCreateLedger({
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
        createLedger({ variables: { data: getValues() } })
    }

    const [show, setShow] = React.useState(true)

    return (
        <Dialog
            title="新建账簿"
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
            <Grid gap={0}>
                <Editor form={form} loading={false} />
            </Grid>
        </Dialog>
    )
}

export default LedgerAdd
