import React from 'react'
import useForm from 'react-hook-form'

import valid from '@/model/validate/ledger'
import { ICreateLedger, ILedger } from '@/model/types/ledger'

export default (data: ILedger) => {
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
