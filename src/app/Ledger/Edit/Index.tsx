import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
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

    const { data, loading } = useLedger({
        variables: {
            id
        },
        skip: !id,
        onError: onApolloError
    })

    const defaultValues = React.useMemo(() => (data && data.ledger) || {}, [
        data
    ])
    const form = useUpdateLedgerForm(defaultValues)
    const { getValues, handleSubmit } = form

    const [updateLedger] = useUpdateLedger({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '创建成功'
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
                        style={{ fontSize: '1.6em' }}
                        onClick={handleSubmit(onSubmit)}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            ></NavigationBar>
            <ContentBody maxWidth="sm">
                <Editor form={form} loading={loading} />
            </ContentBody>
        </>
    )
}

export default LedgerEdit
