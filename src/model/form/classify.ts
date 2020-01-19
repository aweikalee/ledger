import React from 'react'
import useForm from 'react-hook-form'

import valid from '../validate/classify'
import { IClassify, ICreateClassify, IUpdateClassify } from '../types/classify'

export const useCreateClassifyForm = (data: IClassify) => {
    const form = useForm<ICreateClassify>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'text' }, { validate: valid.text })
        register({ name: 'icon' }, { validate: valid.icon })
        register({ name: 'color' }, { validate: valid.color })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('pid', data.pid)
            setValue('text', data.text)
            setValue('icon', data.icon)
            setValue('color', data.color)
        }
    }, [data, setValue])

    return form
}

export const useUpdateClassifyForm = (data: IClassify) => {
    const form = useForm<IUpdateClassify>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: '_id' }, { validate: valid._id })
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'text' }, { validate: valid.text })
        register({ name: 'icon' }, { validate: valid.icon })
        register({ name: 'color' }, { validate: valid.color })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('_id', data._id!)
            setValue('pid', data.pid)
            setValue('text', data.text)
            setValue('icon', data.icon)
            setValue('color', data.color)
        }
    }, [data, setValue])

    return form
}
