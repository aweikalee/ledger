import React from 'react'
import useForm from 'react-hook-form'

import valid from '../validate/record'
import { IRecord, ICreateRecord, IUpdateRecord } from '../types/record'

export const useCreateRecordForm = (data: IRecord) => {
    const form = useForm<ICreateRecord>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

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
        if (data) {
            setValue('pid', data.pid)
            setValue('type', data.type)
            setValue('classify', data.classify)
            setValue('timezone', data.timezone)
            setValue('datetime', data.datetime)
            setValue('detail', data.detail)
            setValue('amount', data.amount)
            setValue('currency', data.currency)
            setValue('payer', data.payer)
            setValue('participator', data.participator)
            setValue('settled', data.settled)
        }
    }, [data, setValue])

    return form
}

export const useUpdateRecordForm = (data: IRecord) => {
    const form = useForm<IUpdateRecord>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: '_id' }, { validate: valid._id })
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
        if (data) {
            setValue('_id', data._id!)
            setValue('pid', data.pid)
            setValue('type', data.type)
            setValue('classify', data.classify)
            setValue('timezone', data.timezone)
            setValue('datetime', data.datetime)
            setValue('detail', data.detail)
            setValue('amount', data.amount)
            setValue('currency', data.currency)
            setValue('payer', data.payer)
            setValue('participator', data.participator)
            setValue('settled', data.settled)
        }
    }, [data, setValue])

    return form
}
