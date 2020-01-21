import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Dialog from '@/components/Dialog'
import Grid from '@/components/Grid'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
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
            <Grid gap={0}>
                <Editor form={form} />
            </Grid>
        </Dialog>
    )
}

export default LedgerAdd
