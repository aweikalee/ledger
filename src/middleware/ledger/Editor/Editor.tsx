import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'

import { useCreateLedgerForm, useUpdateLedgerForm } from '@/model/form/ledger'

import Title from './Title'
import Classify from './Classify'
import Member from './Member'

export interface ILedgerEditorProps {
    form: ReturnType<typeof useCreateLedgerForm | typeof useUpdateLedgerForm>
}

const Editor: React.FC<ILedgerEditorProps> = props => {
    const { form } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateLedgerForm & typeof useUpdateLedgerForm
    >

    return (
        <Grid container gap={4} direction="column">
            {watch('title') === undefined ? null : (
                <Grid>
                    <Input.Control error={!!errors.title}>
                        <Title
                            value={watch('title')}
                            onUpdate={value => setValue('title', value, true)}
                        />
                        <Input.Helper error>
                            {errors.title && errors.title.message}
                        </Input.Helper>
                    </Input.Control>
                </Grid>
            )}
            {watch('_id') === undefined ? null : (
                <>
                    <Grid>
                        <Classify value={watch('_id')} />
                    </Grid>
                    <Grid>
                        <Member value={watch('_id')} />
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default Editor
