import React from 'react'
import useForm from 'react-hook-form'

import valid from '../validate/currency'
import { ICurrency, ICreateCurrency, IUpdateCurrency } from '../types/currency'

export const useCreateCurrencyForm = (data: ICurrency) => {
    const form = useForm<ICreateCurrency>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: 'name' }, { validate: valid.name })
        register({ name: 'cn' }, { validate: valid.cn })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('name', data.name)
            setValue('cn', data.cn)
        }
    }, [data, setValue])

    return form
}

export const useUpdateCurrencyForm = (data: ICurrency) => {
    const form = useForm<IUpdateCurrency>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: '_id' }, { validate: valid._id })
        register({ name: 'name' }, { validate: valid.name })
        register({ name: 'cn' }, { validate: valid.cn })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('_id', data._id!)
            setValue('name', data.name)
            setValue('cn', data.cn)
        }
    }, [data, setValue])

    return form
}
