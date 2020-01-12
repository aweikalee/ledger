import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'

import Calculator from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import { Popup } from '@/components/Popup'
import * as DatePicker from '@/components/DatePicker'
import { Button, Group as ButtonGroup } from '@/components/Button'
import Icon from '@/components/Icon'
import * as Input from '@/components/Input'
import Grid from '@/components/Grid'

import config from '@/config'
import memberMiddleware from '@/middleware/record/member'
import { timeTransform } from '@/utils/timeZone'
import { ILedger, ICreateLedger, IUpdateLedger } from '@/model/types/ledger'
import { useLedger } from '@/model/api/ledger'
import { useCurrencies } from '@/model/api/currency'
import { onApolloError } from '@/model/error'

import styles from './Editor.module.scss'

const LedgerEditor: React.FC<{
    id?: string
    edit?: boolean
}> = props => {
    const { id } = props

    const { getValues, setValue, watch, errors } = useFormContext<
        IUpdateLedger
    >()

    const values = watch()

    const { data } = useLedger({
        variables: { id: id || '' },
        skip: !id,
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    const titleChild =
        values.title === undefined ? null : (
            <Input.Control error={!!errors.title}>
                <Input.Input
                    name="title"
                    id="title"
                    value={values.title}
                    placeholder="账簿名称"
                    onChange={e => setValue('title', e.target.value, true)}
                    clear
                />
                <Input.Helper>
                    {errors.title && errors.title.message}
                </Input.Helper>
            </Input.Control>
        )

    const memberChild = !(data && data.ledger && data.ledger.members) ? null : (
        <>
            <Input.Label>
                成员
                <Button
                    type="outlined"
                    color="primary"
                    size="small"
                    border="round"
                    className={styles['member-option-button']}
                >
                    <Icon text="gear" /> 管理
                </Button>
            </Input.Label>
            <Grid container gap={2}>
                {data.ledger.members.map(member => (
                    <Grid>
                        <Button type="contained" color="primary" border="round">
                            {member.name}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </>
    )

    return (
        <>
            <Grid container gap={2}>
                <Grid sm={12}>{titleChild}</Grid>

                <Grid sm={12}>{memberChild}</Grid>
            </Grid>
        </>
    )
}

export default LedgerEditor
