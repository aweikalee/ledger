import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import useForm from 'react-hook-form'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import Popup from '@/components/Popup'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import valid from '@/model/validate/record'
import { onApolloError } from '@/model/error'
import { useRecord, useUpdateRecord } from '@/model/api/record'
import { IRecord, IUpdateRecord } from '@/model/types/record'

export interface IRecordEditRouteProps {}
export interface IRecordEditProps {
    onClose?: Function

    record: ReturnType<typeof useRecord>
}

const RecordEdit: React.FC<RouteComponentProps<IRecordEditRouteProps> &
    IRecordEditProps> = props => {
    const { onClose, record } = props

    const { data } = record

    const form = useForm<IUpdateRecord>({
        mode: 'onChange'
    })
    const { register, getValues, setValue, watch, handleSubmit, errors } = form

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

    React.useEffect(() => {
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

    const [show, setShow] = React.useState(true)

    return (
        <Popup
            show={show}
            fullScreen
            onExited={() => {
                onClose && onClose()
            }}
        >
            <NavigationBar
                title="编辑账单"
                left={
                    <BackButton icon="close" onClick={() => setShow(false)} />
                }
                right={
                    <Button
                        color="default"
                        size="medium"
                        style={{ fontSize: '1.6em' }}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            ></NavigationBar>
            <ContentBody></ContentBody>
        </Popup>
    )
}

export default RecordEdit
