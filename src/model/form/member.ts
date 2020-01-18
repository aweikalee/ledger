import React from 'react'
import useForm from 'react-hook-form'

import valid from '../validate/member'
import { IMember, ICreateMember, IUpdateMember } from '../types/member'

export const useCreateMemberForm = (data: IMember) => {
    const form = useForm<ICreateMember>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'name' }, { validate: valid.name })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('pid', data.pid)
            setValue('name', data.name)
        }
    }, [data, setValue])

    return form
}

export const useUpdateMemberForm = (data: IMember) => {
    const form = useForm<IUpdateMember>({
        mode: 'onChange',
        defaultValues: data
    })
    const { register, setValue } = form

    React.useEffect(() => {
        register({ name: '_id' }, { validate: valid._id })
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'name' }, { validate: valid.name })
    }, [register])

    React.useEffect(() => {
        if (data) {
            setValue('_id', data._id!)
            setValue('pid', data.pid)
            setValue('name', data.name)
        }
    }, [data, setValue])

    return form
}
