import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import Loading from '@/components/Loading'

import { useCreateMemberForm, useUpdateMemberForm } from '@/model/form/member'

import Name from './Name'

export interface IMemberEditorProps {
    form: ReturnType<typeof useCreateMemberForm | typeof useUpdateMemberForm>
    loading: boolean
}

const Editor: React.FC<IMemberEditorProps> = props => {
    const { form, loading } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateMemberForm & typeof useUpdateMemberForm
    >

    if (loading) {
        return <Loading delay={100} />
    }

    return (
        <>
            {watch('name') === undefined ? null : (
                <>
                    <Name
                        value={watch('name')}
                        onUpdate={value => setValue('name', value, true)}
                    />
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.name && errors.name.message}
                        </Input.Helper>
                    </Grid>
                </>
            )}
        </>
    )
}

export default Editor
