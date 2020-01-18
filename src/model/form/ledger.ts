import React from 'react'
import useForm from 'react-hook-form'

import valid from '../validate/ledger'
import { ILedger, ICreateLedger, IUpdateLedger } from '../types/ledger'

export const useCreateLedgerForm = (data: ILedger) => {
    const form = useForm<ICreateLedger>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: 'title' }, { validate: valid.title })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('title', data.title)
        }
    }, [data, setValue])

    return form
}

export const useUpdateLedgerForm = (data: ILedger) => {
    const form = useForm<IUpdateLedger>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: '_id' }, { validate: valid._id })
        register({ name: 'title' }, { validate: valid.title })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('_id', data._id!)
            setValue('title', data.title)
        }
    }, [data, setValue])

    return form
}
