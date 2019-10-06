import React, { useState } from 'react'
import useForm from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { format } from 'date-fns'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import { Popup } from '@/components/Popup'
import * as DatePicker from '@/components/DatePicker'
import * as valid from '@/utils/valid'
import BigNumberOrigin from 'bignumber.js'
import { Button, Group as ButtonGroup } from '@/components/Button'
import Icon from '@/components/Icon'
import * as Input from '@/components/Input'
import Grid from '@/components/Grid'
import ClassifyPicker from './components/ClassifyPicker'
import { IRecordType } from './components/Record'
import MemberList, { IMember } from './components/MemberList'
import config from '@/config'
import styles from './Index.module.scss'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface ICurrency {
    name: string
    cn: string
}

export interface IForm {
    amount?: string
    currency?: string
    type?: number
    classify?: string
    detail?: string
    datetime?: string
    payer?: string[]
    participator?: string[]
    settled?: string[]
}

const LedgerAdd: React.FC = props => {
    const {
        params: { id }
    } = (props as any).match as {
        params: {
            id: string
        }
    }

    /* initialization */
    const [forms, setForms] = useState<IForm>(() => ({
        type: -1,
        amount: '0',
        currency: 'CNY',
        classify: '',
        datetime: format(new Date(), config.datetimeFormat),
        payer: [],
        participator: [],
        settled: []
    }))
    const { register, setValue, triggerValidation } = useForm<IForm>({
        mode: 'onChange',
        defaultValues: {
            type: forms.type,
            amount: forms.amount,
            currency: forms.currency,
            classify: forms.classify,
            detail: '',
            payer: forms.payer,
            participator: forms.participator,
            settled: forms.settled
        }
    })

    const updateForms = (field: keyof IForm, value: IForm[typeof field]) => {
        setValue(field, value)
        setForms({
            ...forms,
            [field]: value
        })
        triggerValidation([{ name: field }])
    }

    React.useEffect(() => {
        register(
            {
                name: 'type'
            },
            {
                validate: value => {
                    return valid.queue<number>(
                        [
                            (value, options = {}) => {
                                return (
                                    value === -1 ||
                                    value === 1 ||
                                    value === 0 ||
                                    valid.errorFactory('{name}不合法', options)
                                )
                            }
                        ],
                        {
                            name: '类型'
                        }
                    )(value)
                }
            }
        )

        register(
            {
                name: 'amount'
            },
            {
                validate: value => {
                    return valid.queue<string>(
                        [
                            (value, options = {}) => {
                                const number = new BigNumber(
                                    value || ''
                                ).toString()
                                return (
                                    number === value ||
                                    valid.errorFactory('{name}不合法', options)
                                )
                            }
                        ],
                        {
                            name: '金额'
                        }
                    )(value)
                }
            }
        )

        register(
            {
                name: 'currency'
            },
            {
                validate: value => {
                    return valid.queue<string>([valid.isRequire()], {
                        name: '货币种类'
                    })(value)
                }
            }
        )

        register(
            {
                name: 'classify'
            },
            {
                validate: value => {
                    return valid.queue<string>([valid.isRequire()], {
                        name: '分类'
                    })(value)
                }
            }
        )

        register(
            {
                name: 'datetime'
            },
            {
                validate: value => {
                    return valid.queue<string>(
                        [valid.isRequire(), valid.isDate()],
                        {
                            name: '时间'
                        }
                    )(value)
                }
            }
        )

        register(
            {
                name: 'payer'
            },
            {
                validate: value => {
                    return valid.queue<string>(
                        [valid.isRequire(), valid.isDate()],
                        {
                            name: '时间'
                        }
                    )(value)
                }
            }
        )
    }, [register])

    /* Amount */
    const [calculatorShow, setCalculatorShow] = useState(false)

    /* Currency */
    const [showCurrency, setShowCurrency] = useState(false)
    const { data: dataCurrency } = useQuery<{
        currencys: any[]
    }>(
        gql`
            query {
                currencys {
                    name
                    cn
                }
            }
        `
    )

    /* Types */
    const { data: dataTypes } = useQuery<{
        recordTypes: IRecordType[]
    }>(
        gql`
            query($pid: ID!) {
                recordTypes(pid: $pid) {
                    id
                    text
                    icon
                    color
                }
            }
        `,
        {
            variables: {
                pid: id
            }
        }
    )

    /* DateTime */
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const dateChild = (
        <Button
            type="text"
            color="default"
            size="medium"
            block
            onClick={() => setShowDate(true)}
        >
            {format(new Date(forms.datetime!), config.dateFormat)}
        </Button>
    )
    const timeChild = (
        <Button
            type="text"
            color="default"
            size="medium"
            block
            onClick={() => setShowTime(true)}
        >
            {format(new Date(forms.datetime!), config.timeFormat)}
        </Button>
    )

    /* Member */
    const { data: dataMember } = useQuery<{
        members: IMember[]
    }>(
        gql`
            query($id: ID!) {
                members(pid: $id) {
                    id
                    name
                }
            }
        `,
        {
            variables: {
                id: id
            }
        }
    )

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton icon="close" href="/" />}
                right={
                    <Button
                        color="default"
                        size="medium"
                        style={{ fontSize: '1.6em' }}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            />
            <ContentBody>
                <Grid container gap={2}>
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
                                        forms.type === item.value
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    color="primary"
                                    size="small"
                                    border="round"
                                    key={item.value}
                                    onClick={() => {
                                        updateForms('type', item.value)
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Grid>

                    <Grid
                        container
                        gap={2}
                        alignItems="center"
                        className={styles.amount}
                    >
                        <Grid>
                            {/* Currency */}
                            <Button onClick={() => setShowCurrency(true)}>
                                {forms.currency}
                            </Button>

                            <Popup
                                show={showCurrency}
                                onClose={() => setShowCurrency(false)}
                                header
                                title="选择货币种类"
                                contentPadding
                            >
                                {dataCurrency &&
                                    dataCurrency.currencys &&
                                    dataCurrency.currencys.map(item => (
                                        <Button
                                            type={
                                                item.name === forms.currency
                                                    ? 'contained'
                                                    : 'outlined'
                                            }
                                            color={
                                                item.name === forms.currency
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            border="round"
                                            size="large"
                                            key={item.name}
                                            onClick={() => {
                                                updateForms(
                                                    'currency',
                                                    item.name
                                                )
                                                setShowCurrency(false)
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    ))}
                            </Popup>
                        </Grid>

                        <Grid sm>
                            {/* Amount */}
                            <ScreenMini
                                className={styles['amount-screen']}
                                value={forms.amount}
                                onClick={() => setCalculatorShow(true)}
                            />
                            <Calculator
                                value={forms.amount}
                                onUpdate={value => updateForms('amount', value)}
                                show={calculatorShow}
                                onBlur={() => setCalculatorShow(false)}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* type */}
                <ClassifyPicker
                    data={dataTypes ? dataTypes.recordTypes : []}
                    active={forms.classify || ''}
                    onChange={value => updateForms('classify', value)}
                />

                <Grid container gap={2}>
                    {/* detail */}
                    <Grid sm={12}>
                        <Input.Control>
                            <Input.Label htmlFor="detail">描述</Input.Label>
                            <Input.TextArea
                                name="detail"
                                id="detail"
                                ref={register}
                                autosize
                            />
                        </Input.Control>
                    </Grid>

                    {/* datetime */}
                    <Grid sm={12}>
                        <Input.Control>
                            <Input.Label htmlFor="datetime">时间</Input.Label>
                            <Input.Input
                                name="datetime"
                                id="datetime"
                                disabled
                                className={styles['input-datetime']}
                                before={dateChild}
                                after={timeChild}
                            />
                        </Input.Control>
                    </Grid>

                    <DatePicker.Modal
                        show={showDate}
                        onClickOverlay={() => setShowDate(false)}
                    >
                        <DatePicker.DatePicker
                            value={new Date(forms.datetime!)}
                            onConfirm={value => {
                                updateForms(
                                    'datetime',
                                    format(value, config.datetimeFormat)
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
                            value={new Date(forms.datetime!)}
                            onConfirm={value => {
                                updateForms(
                                    'datetime',
                                    format(value, config.datetimeFormat)
                                )
                                setShowTime(false)
                            }}
                            disabledYears
                            disabledMonths
                            disabledDays
                        ></DatePicker.DatePicker>
                    </DatePicker.Modal>

                    {/* member */}
                    <Grid sm={12}>
                        <Input.Label
                            description={
                                <Grid justify="flex-end">
                                    <Grid
                                        className={styles['member-title']}
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
                        </Input.Label>

                        <MemberList
                            members={dataMember && dataMember.members}
                            payer={forms.payer}
                            participator={forms.participator}
                            settled={forms.settled}
                            onUpdate={(type, value) => {
                                const newValue = [...(forms[type] || [])]
                                const index = newValue.indexOf(value)
                                if (index === -1) {
                                    newValue.push(value)
                                } else {
                                    newValue.splice(index, 1)
                                }
                                updateForms(type, newValue)
                            }}
                        />

                        {/* 编辑时可能出现 payer, participator, settled 中存在而 members 中不存在的情况
                           需要抛出提示，并给出清除按钮 */}
                    </Grid>
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerAdd
