import React from 'react'
import { RouteComponentProps } from 'react-router'
import useForm, { FormContext } from 'react-hook-form'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/record'
import { useLedger } from '@/model/api/ledger'
import { useCreateRecord } from '@/model/api/record'
import { ICreateRecord } from '@/model/types/record'
import { onApolloError } from '@/model/error'
import { localTimeOffset, timeTransform } from '@/utils/timeZone'

import Editor from '../Record/components/Editor'

export interface ILedgerAddRouteProps {
    id: string
}

const LedgerAdd: React.FC<RouteComponentProps<
    ILedgerAddRouteProps
>> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    /* initialization */
    const form = useForm<ICreateRecord>({
        mode: 'onChange',
        defaultValues: {
            pid: id,
            type: -1,
            classify: '',
            timezone: localTimeOffset,
            datetime: timeTransform.toUTC(Date.now()),
            detail: '',
            amount: '0',
            currency: 'CNY',
            payer: [],
            participator: [],
            settled: []
        }
    })
    const { register, getValues, handleSubmit } = form

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
        register({ name: 'particaptor' }, { validate: valid.participator })
        register({ name: 'settled' }, { validate: valid.settled })
    }, [register])

    /* Ledger */
    const { data } = useLedger({
        variables: { id },
        fetchPolicy: 'cache-and-network'
    })

    const [createRecord] = useCreateRecord({
        onError: onApolloError,
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
                subTitle={(data && data.ledger && data.ledger.title) || ''}
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
                    <Editor pid={id} />
                </FormContext>
            </ContentBody>
        </>
    )
}

export default LedgerAdd
