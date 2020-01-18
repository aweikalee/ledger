import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import Grid from '@/components/Grid'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import * as Input from '@/components/Input'
import notification from '@/components/Notification'

import { onApolloError } from '@/model/error'
import { useLedger, useUpdateLedger } from '@/model/api/ledger'

import useForm from './useForm'

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

    const { data } = useLedger({
        variables: {
            id
        },
        skip: !id,
        onError: onApolloError
    })

    const form = useForm((data && data.ledger) || {})
    const { watch, getValues, setValue, handleSubmit, errors } = form

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
                <Grid container gap={4} direction="column">
                    <Grid>
                        <Input.Control error={!!errors.title}>
                            <Input.Input
                                name="title"
                                id="title"
                                value={watch('title') || ''}
                                placeholder="账簿名称"
                                onChange={e =>
                                    setValue('title', e.target.value, true)
                                }
                                clear
                            />
                            <Input.Helper>
                                {errors.title && errors.title.message}
                            </Input.Helper>
                        </Input.Control>
                    </Grid>
                </Grid>
            </ContentBody>
        </>
    )
}

export default LedgerEdit
