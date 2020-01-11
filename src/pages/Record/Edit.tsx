import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import useForm, { FormContext } from 'react-hook-form'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/record'
import { IUpdateRecord } from '@/model/types/record'
import { onApolloError } from '@/model/error'
import { useRecord, useUpdateRecord } from '@/model/api/record'

import Editor from './components/Editor'

export interface IRecordEditRouteProps {
    id: string
}

const RecordEdit: React.FC<RouteComponentProps<
    IRecordEditRouteProps
>> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    /* initialization */
    const { data } = useRecord({
        variables: { id },
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    const form = useForm<IUpdateRecord>({ mode: 'onChange' })
    const { register, getValues, setValue, handleSubmit } = form

    React.useEffect(() => {
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'type' }, { validate: valid.type })
        register({ name: 'classify' }, { validate: valid.classify })
        register({ name: 'timezone' }, { validate: valid.timezone })
        register({ name: 'datetime' }, { validate: valid.datetime })
        register({ name: 'detail' }, { validate: valid.detail })
        register({ name: 'amount' }, { validate: valid.amount })
        register({ name: 'currency' }, { validate: valid.currency })
        register({ name: 'payer' }, { validate: valid.payer })
        register({ name: 'participator' }, { validate: valid.participator })
        register({ name: 'settled' }, { validate: valid.settled })
    }, [register])

    useEffect(() => {
        if (data && data.record) {
            const record = data.record
            setValue('pid', record.pid)
            setValue('type', record.type)
            setValue('classify', record.classify)
            setValue('timezone', record.timezone)
            setValue('datetime', record.datetime)
            setValue('detail', record.detail)
            setValue('amount', record.amount)
            setValue('currency', record.currency)
            setValue('payer', record.payer)
            setValue('participator', record.participator)
            setValue('settled', record.settled)
        }
    }, [data, setValue])

    const [updateRecord] = useUpdateRecord({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '更新成功'
            })
            if (data && data.record && data.record.pid) {
                history.push(`/ledger/${data.record.pid}`)
            }
        }
    })

    const onSubmit = () => {
        const _data = {
            _id: id,
            ...getValues()
        }
        updateRecord({ variables: { data: _data } })
    }

    return (
        <>
            <NavigationBar
                title="编辑账单"
                left={
                    data && data.record ? (
                        <BackButton
                            icon="close"
                            href={`/ledger/${data.record.pid}`}
                        />
                    ) : (
                        <BackButton
                            icon="close"
                            onClick={() => props.history.goBack()}
                        />
                    )
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
            />
            <ContentBody>
                <FormContext {...form}>
                    {data && data.record && data.record.pid && (
                        <Editor pid={data.record.pid} />
                    )}
                </FormContext>
            </ContentBody>
        </>
    )
}

export default RecordEdit
