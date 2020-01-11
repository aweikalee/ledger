import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import useForm, { FormContext } from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/record'
import { IReport } from '@/model/types/graphql'
import { IUpdateRecord, IRecord } from '@/model/types/record'
import { onApolloError } from '@/model/error'

import Editor from '@/middleware/record/editor'

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
    const { data } = useQuery<{
        record: IRecord | null
    }>(
        gql`
            query($id: ID!) {
                record(id: $id) {
                    pid
                    type
                    classify
                    timezone
                    datetime
                    detail
                    amount
                    currency
                    rate
                    payer
                    participator
                    settled
                }
            }
        `,
        { variables: { id }, fetchPolicy: 'cache-and-network' }
    )

    const form = useForm<IUpdateRecord>({ mode: 'onChange' })
    const { register, getValues, setValue, handleSubmit, watch } = form

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
            watch()
        }
    }, [data, setValue, watch])

    const [updateRecord] = useMutation<
        {
            updateRecord: IReport
        },
        {
            data: IUpdateRecord
        }
    >(
        gql`
            mutation($data: UpdateRecord) {
                updateRecord(data: $data) {
                    code
                    message
                }
            }
        `,
        {
            onError: onApolloError,
            onCompleted() {
                notification.success({
                    content: '更新成功'
                })
                history.push(
                    `/ledger/${data && data.record && data.record.pid}`
                )
            }
        }
    )

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
                left={<BackButton icon="close" href={`/ledger/${id}`} />}
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
