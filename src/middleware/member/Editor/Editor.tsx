import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'

import { useCreateMemberForm, useUpdateMemberForm } from '@/model/form/member'

import Name from './Name'

export interface IMemberEditorProps {
    form: ReturnType<typeof useCreateMemberForm | typeof useUpdateMemberForm>
}

const Editor: React.FC<IMemberEditorProps> = props => {
    const { form } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateMemberForm & typeof useUpdateMemberForm
    >

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
