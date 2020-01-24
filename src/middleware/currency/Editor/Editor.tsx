import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import Loading from '@/components/Loading'

import {
    useCreateCurrencyForm,
    useUpdateCurrencyForm
} from '@/model/form/currency'

import Name from './Name'
import Cn from './Cn'

export interface ICurrencyEditorProps {
    form: ReturnType<
        typeof useCreateCurrencyForm | typeof useUpdateCurrencyForm
    >
    loading: boolean
}

const Editor: React.FC<ICurrencyEditorProps> = props => {
    const { form, loading } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateCurrencyForm & typeof useUpdateCurrencyForm
    >

    if (loading) {
        return <Loading delay={100} />
    }

    return (
        <Grid container gap={2} direction="column">
            {watch('name') === undefined ? null : (
                <Grid>
                    <Input.Label htmlFor="name">货币标识</Input.Label>
                    <Name
                        value={watch('name')}
                        onUpdate={value => setValue('name', value, true)}
                    />
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.name && errors.name.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}

            {watch('cn') === undefined ? null : (
                <Grid>
                    <Input.Label htmlFor="name" description="中文">
                        货币名称
                    </Input.Label>
                    <Cn
                        value={watch('cn')}
                        onUpdate={value => setValue('cn', value, true)}
                    />
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.cn && errors.cn.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default Editor
