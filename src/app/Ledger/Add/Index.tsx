import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

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
import { localTimeOffset, timeTransform } from '@/utils/timeZone'
import { IRecord } from '@/model/types/record'
import { useCreateRecordForm } from '@/model/form/record'
import { useCreateRecord } from '@/model/api/record'
import Editor from '@/middleware/record/Editor'

import Hook from '../../Index/Ledger/Hook'

export interface IRecordAddRouteProps {
    id: string
}
export interface IRecordAddProps {}

const RecordAdd: React.FC<RouteComponentProps<IRecordAddRouteProps> &
    IRecordAddProps> = props => {
    const {
        history,
        match: {
            path,
            params: { id }
        }
    } = props

    const defaultValues = React.useMemo<IRecord>(
        () => ({
            pid: id,
            type: -1,
            classify: null,
            timezone: localTimeOffset,
            datetime: timeTransform.toUTC(Date.now()),
            detail: '',
            amount: '0',
            currency: 'CNY',
            payer: [],
            participator: [],
            settled: []
        }),
        [id]
    )

    const form = useCreateRecordForm(defaultValues)
    const { getValues, handleSubmit, setError } = form

    const [createRecord, { loading }] = useCreateRecord({
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
            history.push(`/ledger/${id}`)
        }
    })

    const onSubmit = () => {
        createRecord({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title="新增账单"
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
                <Editor form={form} loading={false} />
            </ContentBody>

            <Route path={path} component={Hook} />
        </>
    )
}

export default RecordAdd
