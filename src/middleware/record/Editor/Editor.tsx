import React from 'react'

import Grid from '@/components/Grid'
import * as Input from '@/components/Input'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import Loading from '@/components/Loading'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { ILedger } from '@/model/types/ledger'
import { useCurrencies } from '@/model/api/currency'
import { useCreateRecordForm, useUpdateRecordForm } from '@/model/form/record'

import Type from './Type'
import Currency from './Currency'
import Amount from './Amount'
import Classify from './Classify'
import Detail from './Detail'
import Datetime from './Datetime'
import Members from './Members'
import { timeTransform } from '@/utils/timeZone'

import displayStyles from '../styles.module.scss'
import styles from './Editor.module.scss'

export interface IRecordEditorProps {
    form: ReturnType<typeof useCreateRecordForm | typeof useUpdateRecordForm>
    loading: boolean
}

const Editor: React.FC<IRecordEditorProps> = props => {
    const { form, loading } = props
    const { watch, setValue, errors } = form as ReturnType<
        typeof useCreateRecordForm & typeof useUpdateRecordForm
    >

    const { data: ledger, loading: ledgerLoading } = useStore().ledger

    const { data: currencies, loading: currenciesLoading } = useCurrencies({
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    /* members */
    const checkMembers = (members: ILedger['members'] = [], ids: string[]) => {
        return !ids.find(id => {
            return !members.find(member => member._id === id)
        })
    }
    const checkGhost = () => {
        const members = (ledger && ledger.members) || []
        return (
            checkMembers(members, watch('payer') || []) &&
            checkMembers(members, watch('participator') || []) &&
            checkMembers(members, watch('settled') || [])
        )
    }
    const clearGhost = () => {
        const members = (ledger && ledger.members) || []

        const filter = (arr: string[] = []) => {
            return arr.filter(v => {
                return !!members.find(member => member._id === v)
            })
        }
        setValue('payer', filter(watch('payer')), true)
        setValue('participator', filter(watch('participator')), true)
        setValue('settled', filter(watch('settled')), true)
    }

    if (loading || ledgerLoading || currenciesLoading) {
        return <Loading delay={100} />
    }

    return (
        <Grid container direction="column" gap={4}>
            {/* type 收支类型 */}
            {watch('type') === undefined ? null : (
                <Grid>
                    <Type
                        value={watch('type')}
                        onUpdate={value => setValue('type', value, true)}
                    />
                    <Grid sm={12} justify="center">
                        <Input.Helper error>
                            {errors.type && errors.type.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}

            {watch('currency') === undefined ||
            watch('amount') === undefined ? null : (
                <Grid container alignItems="baseline">
                    {/* currency 货币种类 */}
                    <Grid>
                        <Currency
                            value={watch('currency')}
                            currencies={
                                (currencies && currencies.currencies) || []
                            }
                            onUpdate={value =>
                                setValue('currency', value, true)
                            }
                        />
                    </Grid>

                    {/* amount 金额 */}
                    <Grid sm>
                        <Amount
                            value={watch('amount')}
                            onUpdate={value => setValue('amount', value, true)}
                        />
                    </Grid>

                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.currency && errors.currency.message}
                        </Input.Helper>
                    </Grid>
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.amount && errors.amount.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}

            {/* classify 分类 */}
            {watch('classify') === undefined ? null : (
                <Grid>
                    <Input.Label htmlFor="classify">
                        分类
                        <Button
                            href={
                                ledger ? `/classify/${ledger._id}` : undefined
                            }
                            type="outlined"
                            color="primary"
                            size="small"
                            border="round"
                            style={{
                                marginLeft: '0.12rem',
                                fontWeight: 'normal'
                            }}
                        >
                            <Icon text="gear" /> 管理
                        </Button>
                    </Input.Label>
                    <Classify
                        value={watch('classify')}
                        classifies={ledger && ledger.classifies}
                        onUpdate={value => setValue('classify', value, true)}
                    />
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.classify && errors.classify.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}

            {/* deital 描述 */}
            {watch('detail') === undefined ? null : (
                <Grid>
                    <Input.Control error={!!errors.detail}>
                        <Input.Label htmlFor="detail">描述</Input.Label>
                        <Detail
                            value={watch('detail')}
                            onUpdate={value => setValue('detail', value, true)}
                        />
                        <Input.Helper>
                            {errors.detail && errors.detail.message}
                        </Input.Helper>
                    </Input.Control>
                </Grid>
            )}

            {/* datetime 时间 */}
            {watch('datetime') === undefined ? null : (
                <Grid>
                    <Input.Control error={!!errors.datetime}>
                        <Input.Label htmlFor="datetime">时间</Input.Label>
                        <Datetime
                            value={timeTransform.toLocal(
                                watch('datetime') || 0
                            )}
                            onUpdate={value =>
                                setValue(
                                    'datetime',
                                    timeTransform.toUTC(value || 0),
                                    true
                                )
                            }
                        />
                        <Input.Helper>
                            {errors.datetime && errors.datetime.message}
                        </Input.Helper>
                    </Input.Control>
                </Grid>
            )}

            {/* members 成员 */}
            {[watch('payer'), watch('participator'), watch('settled')].includes(
                undefined
            ) ? null : (
                <Grid>
                    <Input.Label
                        htmlFor="member"
                        description={
                            <Grid justify="flex-end">
                                <Grid
                                    className={displayStyles['members-width']}
                                    justify="space-around"
                                >
                                    <Grid>支付</Grid>
                                    <Grid>消费</Grid>
                                    <Grid>还清</Grid>
                                </Grid>
                            </Grid>
                        }
                    >
                        成员
                        <Button
                            href={ledger ? `/member/${ledger._id}` : undefined}
                            type="outlined"
                            color="primary"
                            size="small"
                            border="round"
                            style={{
                                marginLeft: '0.12rem',
                                fontWeight: 'normal'
                            }}
                        >
                            <Icon text="gear" /> 管理
                        </Button>
                    </Input.Label>
                    <Members
                        payer={watch('payer')}
                        participator={watch('participator')}
                        settled={watch('settled')}
                        members={ledger && ledger.members}
                        onUpdate={(type, value) => setValue(type, value, true)}
                    >
                        <Grid
                            justify="center"
                            alignItems="center"
                            container
                            gap={4}
                            className={styles['member-placeholder']}
                        >
                            请
                            <Button
                                href={
                                    ledger ? `/member/${ledger._id}` : undefined
                                }
                                type="text"
                                color="primary"
                                size="medium"
                            >
                                添加成员
                            </Button>
                        </Grid>
                    </Members>

                    <Grid sm={12}>
                        <Input.Helper error>
                            {checkGhost() || (
                                <>
                                    存在幽灵成员，请点击{' '}
                                    <Button
                                        type="contained"
                                        color="error"
                                        size="small"
                                        border="round"
                                        onClick={clearGhost}
                                    >
                                        清除
                                    </Button>
                                </>
                            )}
                        </Input.Helper>
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default Editor
