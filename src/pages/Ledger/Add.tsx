import React from 'react'
import { RouteComponentProps } from 'react-router'
import useForm, { FormContext } from 'react-hook-form'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/ledger'
import { useCreateLedger } from '@/model/api/ledger'
import { ICreateLedger } from '@/model/types/ledger'
import { onApolloError } from '@/model/error'

import Editor from './components/Editor'

export interface ILedgerAddRouteProps {}

const LedgerAdd: React.FC<RouteComponentProps<
    ILedgerAddRouteProps
>> = props => {
    const { history } = props

    /* initialization */
    const form = useForm<ICreateLedger>({
        mode: 'onChange',
        defaultValues: {
            title: ''
        }
    })
    const { register, getValues, handleSubmit } = form

    React.useEffect(() => {
        register({ name: 'title' }, { validate: valid.title })
    }, [register])

    const [createLedger] = useCreateLedger({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '创建成功'
            })
            history.push(`/`)
        }
    })

    const onSubmit = () => {
        createLedger({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title="新增账簿"
                left={<BackButton icon="close" href="/" />}
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
                    <Editor/>
                </FormContext>
            </ContentBody>
        </>
    )
}

export default LedgerAdd
