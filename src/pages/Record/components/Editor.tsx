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
import { ICreateRecord, IUpdateRecord } from '@/model/types/record'
import { ILedger } from '@/model/types/ledger'
import { useLedger } from '@/model/api/ledger'
import { useCurrencies } from '@/model/api/currency'

import Members from './Members'
import MembersStyles from './Members.module.scss'
import ClassifyPicker from './ClassifyPicker'
import styles from './Editor.module.scss'

const RecordEditor: React.FC<{
    pid: string
}> = props => {
    const { pid } = props

    const { getValues, setValue, watch, errors } = useFormContext<
        IUpdateRecord
    >()

    const values = watch()

    const { data } = useLedger({
        variables: { id: pid },
        fetchPolicy: 'cache-and-network'
    })

    const { data: currencies } = useCurrencies({
        fetchPolicy: 'cache-and-network'
    })

    /* type */
    const typeChild =
        values.type === undefined ? null : (
            <Grid container justify="center">
                <ButtonGroup className={styles['type-bar']}>
                    {[
                        {
                            value: -1,
                            text: '支出'
                        },
                        {
                            value: 0,
                            text: '转账'
                        },
                        {
                            value: 1,
                            text: '收入'
                        }
                    ].map(item => (
                        <Button
                            type={
                                values.type === item.value
                                    ? 'contained'
                                    : 'outlined'
                            }
                            color="primary"
                            size="small"
                            border="round"
                            key={item.value}
                            onClick={() => {
                                setValue(
                                    'type',
                                    item.value as ICreateRecord['type'],
                                    true
                                )
                            }}
                        >
                            {item.text}
                        </Button>
                    ))}
                </ButtonGroup>
                <Grid sm={12} justify="center">
                    <Input.Helper error>
                        {errors.type && errors.type.message}
                    </Input.Helper>
                </Grid>
            </Grid>
        )

    /* currency */
    const [showCurrency, setShowCurrency] = useState(false)
    const currencyChild =
        values.currency === undefined ? null : (
            <>
                <Button onClick={() => setShowCurrency(true)}>
                    {values.currency}
                </Button>

                <Popup
                    show={showCurrency}
                    onClose={() => setShowCurrency(false)}
                    header
                    title="选择货币种类"
                    contentPadding
                >
                    {currencies &&
                        currencies.currencies &&
                        currencies.currencies.map(item => (
                            <Button
                                type={
                                    item.name === values.currency
                                        ? 'contained'
                                        : 'outlined'
                                }
                                color={
                                    item.name === values.currency
                                        ? 'primary'
                                        : 'default'
                                }
                                border="round"
                                size="large"
                                key={item.name}
                                onClick={() => {
                                    setValue('currency', item.name, true)
                                    setShowCurrency(false)
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                </Popup>
            </>
        )

    /* amount */
    const [calculatorShow, setCalculatorShow] = useState(false)
    const amountChild =
        values.amount === undefined ? null : (
            <>
                <ScreenMini
                    className={styles['amount-screen']}
                    value={values.amount}
                    onClick={() => setCalculatorShow(true)}
                />
                <Calculator
                    value={values.amount}
                    onUpdate={value => setValue('amount', value, true)}
                    show={calculatorShow}
                    onBlur={() => setCalculatorShow(false)}
                />
            </>
        )

    /* currency & amount */
    const currencyAndAmountChild =
        !currencyChild || !amountChild ? null : (
            <>
                <Grid
                    container
                    gap={2}
                    alignItems="center"
                    className={styles.amount}
                >
                    <Grid>{currencyChild}</Grid>

                    <Grid sm>{amountChild}</Grid>
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
            </>
        )

    /* classify */
    const classifyChild =
        values.classify === undefined ? null : (
            <>
                <ClassifyPicker
                    data={(data && data.ledger && data.ledger.classifies) || []}
                    active={values.classify || ''}
                    onChange={value => setValue('classify', value, true)}
                />
                <Grid container gap={2}>
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.classify && errors.classify.message}
                        </Input.Helper>
                    </Grid>
                </Grid>
            </>
        )

    /* detail */
    const detailChild =
        values.detail === undefined ? null : (
            <Input.Control error={!!errors.detail}>
                <Input.Label htmlFor="detail">描述</Input.Label>
                <Input.TextArea
                    name="detail"
                    id="detail"
                    value={values.detail}
                    onChange={e => setValue('detail', e.target.value, true)}
                    autosize
                />
                <Input.Helper>
                    {errors.detail && errors.detail.message}
                </Input.Helper>
            </Input.Control>
        )

    /* datetime */
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const dateChild =
        values.datetime === undefined ? null : (
            <Button
                type="text"
                color="default"
                size="medium"
                block
                onClick={() => setShowDate(true)}
            >
                {format(
                    new Date(timeTransform.toLocal(values.datetime)),
                    config.dateFormat
                )}
            </Button>
        )
    const timeChild =
        values.datetime === undefined ? null : (
            <Button
                type="text"
                color="default"
                size="medium"
                block
                onClick={() => setShowTime(true)}
            >
                {format(
                    new Date(timeTransform.toLocal(values.datetime)),
                    config.timeFormat
                )}
            </Button>
        )

    const datetimeChild =
        !dateChild || !timeChild ? null : (
            <>
                <Input.Control error={!!errors.datetime}>
                    <Input.Label htmlFor="datetime">时间</Input.Label>
                    <Input.Input
                        name="datetime"
                        id="datetime"
                        disabled
                        className={styles['input-datetime']}
                        before={dateChild}
                        after={timeChild}
                    />
                    <Input.Helper>
                        {errors.datetime && errors.datetime.message}
                    </Input.Helper>
                </Input.Control>

                <DatePicker.Modal
                    show={showDate}
                    onClickOverlay={() => setShowDate(false)}
                >
                    <DatePicker.DatePicker
                        value={
                            new Date(timeTransform.toLocal(values.datetime!))
                        }
                        onConfirm={value => {
                            setValue(
                                'datetime',
                                timeTransform.toUTC(value.getTime()),
                                true
                            )
                            setShowDate(false)
                        }}
                        disabledHours
                        disabledMinutes
                        disabledSeconds
                    ></DatePicker.DatePicker>
                </DatePicker.Modal>

                <DatePicker.Modal
                    show={showTime}
                    onClickOverlay={() => setShowTime(false)}
                >
                    <DatePicker.DatePicker
                        value={
                            new Date(timeTransform.toLocal(values.datetime!))
                        }
                        onConfirm={value => {
                            setValue(
                                'datetime',
                                timeTransform.toUTC(value.getTime()),
                                true
                            )
                            setShowTime(false)
                        }}
                        disabledYears
                        disabledMonths
                        disabledDays
                    ></DatePicker.DatePicker>
                </DatePicker.Modal>
            </>
        )

    /* members */
    const checkMembers = (members: ILedger['members'] = [], ids: string[]) => {
        return !ids.find(id => {
            return !members.find(member => member._id === id)
        })
    }
    const checkGhost = () => {
        const members = (data && data.ledger && data.ledger.members) || []
        return (
            checkMembers(members, values.payer || []) &&
            checkMembers(members, values.participator || []) &&
            checkMembers(members, values.settled || [])
        )
    }
    const clearGhost = () => {
        const members = (data && data.ledger && data.ledger.members) || []

        const filter = (arr: string[] = []) => {
            return arr.filter(v => {
                return !!members.find(member => member._id === v)
            })
        }
        setValue('payer', filter(values.payer), true)
        setValue('participator', filter(values.participator), true)
        setValue('settled', filter(values.settled), true)
    }
    const membersChild = (
        <>
            <Input.Label
                description={
                    <Grid justify="flex-end">
                        <Grid
                            className={MembersStyles.width}
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
                    type="outlined"
                    color="primary"
                    size="small"
                    border="round"
                    className={styles['member-option-button']}
                >
                    <Icon text="gear" /> 管理
                </Button>
            </Input.Label>
            <Members
                display="checkbox"
                members={memberMiddleware(
                    {
                        payer: values.payer,
                        participator: values.participator,
                        settled: values.settled
                    },
                    (data && data.ledger && data.ledger.members) || []
                )}
                onUpdate={(type, value) => {
                    const newValue = [...(getValues()[type] || [])]
                    const index = newValue.indexOf(value)
                    if (index === -1) {
                        newValue.push(value)
                    } else {
                        newValue.splice(index, 1)
                    }
                    setValue(type, newValue, true)
                }}
            />

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

            <Input.Helper error>
                {errors.payer && errors.payer.message}
                {errors.participator && errors.participator.message}
                {errors.settled && errors.settled.message}
            </Input.Helper>
        </>
    )

    return (
        <>
            <Grid container gap={2}>
                {typeChild}
                {currencyAndAmountChild}
            </Grid>

            {classifyChild}

            <Grid container gap={2}>
                <Grid sm={12}>{detailChild}</Grid>
                <Grid sm={12}>{datetimeChild}</Grid>
                <Grid sm={12}>{membersChild}</Grid>
            </Grid>
        </>
    )
}

export default RecordEditor
