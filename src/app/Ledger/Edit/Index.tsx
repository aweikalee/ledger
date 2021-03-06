import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
import { useLedger, useUpdateLedger } from '@/model/api/ledger'
import { useUpdateLedgerForm } from '@/model/form/ledger'
import Editor from '@/middleware/ledger/Editor'

export interface ILedgerEditRouteProps {
    id: string
}
export interface ILedgerEditProps {}

const LedgerEdit: React.FC<RouteComponentProps<ILedgerEditRouteProps> &
    ILedgerEditProps> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    const { data, loading: ledgerLoading } = useLedger({
        variables: {
            id
        },
        skip: !id,
        onError: onApolloServerError({
            CastError() {
                history.replace('/404')
            }
        }),
        onCompleted(data) {
            if (data && data.ledger === null) {
                history.replace('/404')
            }
        }
    })

    const defaultValues = React.useMemo(() => (data && data.ledger) || {}, [
        data
    ])
    const form = useUpdateLedgerForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [updateLedger, { loading }] = useUpdateLedger({
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
                content: '更新成功'
            })
            history.push('/collection/edit')
        }
    })

    const onSubmit = () => {
        updateLedger({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title="编辑账簿"
                left={
                    <BackButton
                        icon="close"
                        onClick={() => {
                            history.push('/collection/edit')
                        }}
                    />
                }
                right={
                    <Button
                        color="default"
                        size="medium"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? (
                            <PointSpinner style={{ fontSize: '0.8em' }} />
                        ) : (
                            <Icon
                                text="confirm"
                                style={{ fontSize: '1.6em' }}
                            />
                        )}
                    </Button>
                }
            ></NavigationBar>
            <ContentBody maxWidth="sm">
                <Editor form={form} loading={ledgerLoading} />
            </ContentBody>
        </>
    )
}

export default LedgerEdit
