import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'
import { PointSpinner } from '@/components/Loading'

import { useStore } from '@/store'
import {
    onApolloServerError,
    processorServerError
} from '@/model/error/ApolloError'
import { useRecord } from '@/model/api/record'
import { useUpdateRecordForm } from '@/model/form/record'
import { useUpdateRecord } from '@/model/api/record'
import Editor from '@/middleware/record/Editor'

export interface IRecordEditRouteProps {
    id: string
}
export interface IRecordEditProps {}

const RecordEdit: React.FC<RouteComponentProps<IRecordEditRouteProps> &
    IRecordEditProps> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    const { ledger } = useStore()
    const { data, loading: recordLoding } = useRecord({
        variables: {
            id
        },
        skip: !id,
        onCompleted(data) {
            if (data && data.record) {
                if (data.record.pid !== ledger.id) {
                    ledger.setId(data.record.pid)
                }
            }
        }
    })

    const defaultValues = React.useMemo(() => (data && data.record) || {}, [
        data
    ])
    const form = useUpdateRecordForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [updateRecord, { loading }] = useUpdateRecord({
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
            history.push('/')
        }
    })

    const onSubmit = () => {
        updateRecord({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title="编辑账单"
                left={
                    <BackButton
                        icon="close"
                        onClick={() => {
                            history.push('/')
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
            <ContentBody>
                <Editor form={form} loading={recordLoding || ledger.loading} />
            </ContentBody>
        </>
    )
}

export default RecordEdit
