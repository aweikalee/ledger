import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import Loading from '@/components/Loading'

import {
    useCreateClassifyForm,
    useUpdateClassifyForm
} from '@/model/form/classify'

import * as display from '../../record/display'

import Text from './Text'
import Icon from './Icon'
import Color from './Color'

export interface IMemberEditorProps {
    form: ReturnType<
        typeof useCreateClassifyForm | typeof useUpdateClassifyForm
    >
    loading: boolean
}

const Editor: React.FC<IMemberEditorProps> = props => {
    const { form, loading } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateClassifyForm & typeof useUpdateClassifyForm
    >

    if (loading) {
        return <Loading delay={100} />
    }

    return (
        <Grid container direction="column" gap={2}>
            {watch('icon') === undefined ||
            watch('color') === undefined ? null : (
                <Grid>
                    <Grid justify="center" alignItems="center" sm={6}>
                        <display.Icon
                            style={{ fontSize: '0.5rem' }}
                            classify={{
                                icon: watch('icon'),
                                color: watch('color')
                            }}
                        />
                    </Grid>
                    <Grid sm={6} direction="column">
                        <Grid>
                            <Icon
                                value={watch('icon')}
                                onUpdate={value =>
                                    setValue('icon', value, true)
                                }
                            />
                        </Grid>
                        <Grid>
                            <Color
                                value={watch('color')}
                                onUpdate={value =>
                                    setValue('color', value, true)
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.icon && errors.icon.message}
                        </Input.Helper>
                    </Grid>
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.color && errors.color.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}
            {watch('text') === undefined ? null : (
                <Grid>
                    <Text
                        value={watch('text')}
                        onUpdate={value => setValue('text', value, true)}
                    />
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.text && errors.text.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default Editor
