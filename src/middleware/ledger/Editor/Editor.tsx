import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import Loading from '@/components/Loading'

import { useCreateLedgerForm, useUpdateLedgerForm } from '@/model/form/ledger'

import Title from './Title'
import Classify from './Classify'
import Member from './Member'

export interface ILedgerEditorProps {
    form: ReturnType<typeof useCreateLedgerForm | typeof useUpdateLedgerForm>
    loading: boolean
}

const Editor: React.FC<ILedgerEditorProps> = props => {
    const { form, loading } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateLedgerForm & typeof useUpdateLedgerForm
    >

    if (loading) {
        return <Loading delay={100} />
    }

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
