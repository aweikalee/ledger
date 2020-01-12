import React from 'react'
import { RouteComponentProps } from 'react-router'
import useForm, { FormContext } from 'react-hook-form'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/ledger'
import { useLedger, useUpdateLedger } from '@/model/api/ledger'
import { IUpdateLedger } from '@/model/types/ledger'
import { onApolloError } from '@/model/error'

import Editor from './components/Editor'

export interface ILedgerEditRouteProps {
    id: string
}

const LedgerEdit: React.FC<RouteComponentProps<
    ILedgerEditRouteProps
>> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    /* initialization */
    const { data } = useLedger({
        variables: { id },
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    const form = useForm<IUpdateLedger>({ mode: 'onChange' })
    const { register, getValues, setValue, handleSubmit } = form

    React.useEffect(() => {
        register({ name: 'title' }, { validate: valid.title })
    }, [register])

    React.useEffect(() => {
        if (data && data.ledger) {
            const ledger = data.ledger
            setValue('title', ledger.title)
        }
    }, [data, setValue])

    const [updateLedger] = useUpdateLedger({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '更新成功'
            })
            history.push(`/ledger/${id}`)
        }
    })

    const onSubmit = () => {
        updateLedger({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title={(data && data.ledger && data.ledger.title) || ''}
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
                    <Editor edit id={id} />
                </FormContext>
            </ContentBody>
        </>
    )
}

export default LedgerEdit
