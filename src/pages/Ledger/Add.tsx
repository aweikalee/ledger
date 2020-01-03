import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import useForm from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { format } from 'date-fns'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import Calculator from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import { Popup } from '@/components/Popup'
import * as DatePicker from '@/components/DatePicker'
import { Button, Group as ButtonGroup } from '@/components/Button'
import Icon from '@/components/Icon'
import * as Input from '@/components/Input'
import Grid from '@/components/Grid'
import notification from '@/components/Notification'

import config from '@/config'
import memberMiddleware from '@/middleware/record/member'
import valid from '@/model/validate/record'
import { IReport } from '@/model/types/graphql'
import { ILedger } from '@/model/types/ledger'
import { ICreateRecord } from '@/model/types/record'
import { ICurrency } from '@/model/types/currency'
import { onApolloError } from '@/model/error'
import { localTimeOffset, timeTransform } from '@/utils/timeZone'

import MembersStyles from '../Record/components/Members.module.scss'
import Members from '../Record/components/Members'
import ClassifyPicker from './components/ClassifyPicker'
import styles from './Index.module.scss'

export interface ILedgerAddRouteProps {
    id: string
}

const LedgerAdd: React.FC<RouteComponentProps<
    ILedgerAddRouteProps
>> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    /* initialization */
    const { register, getValues, setValue, handleSubmit, errors } = useForm<
        ICreateRecord
    >({
        mode: 'onChange',
        defaultValues: {
            pid: id,
            type: -1,
            classify: '',
            timezone: localTimeOffset,
            datetime: timeTransform.toUTC(Date.now()),
            detail: '',
            amount: '0',
            currency: 'CNY',
            payer: [],
            participator: [],
            settled: []
        }
    })

    React.useEffect(() => {
        register({ name: 'pid' }, { validate: valid.pid })
        register({ name: 'type' }, { validate: valid.type })
        register({ name: 'classify' }, { validate: valid.classify })
        register({ name: 'timezone' }, { validate: valid.timezone })
        register({ name: 'datetime' }, { validate: valid.datetime })
        register({ name: 'detail' }, { validate: valid.detail })
        register({ name: 'amount' }, { validate: valid.amount })
        register({ name: 'currency' }, { validate: valid.currency })
        register({ name: 'payer' }, { validate: valid.payer })
        register({ name: 'particaptor' }, { validate: valid.participator })
        register({ name: 'settled' }, { validate: valid.settled })
    }, [register])

    /* Amount */
    const [calculatorShow, setCalculatorShow] = useState(false)

    /* Currency */
    const [showCurrency, setShowCurrency] = useState(false)

    /* Ledger */
    const { data } = useQuery<{
        currencys: ICurrency[] | null
        ledger: ILedger | null
    }>(
        gql`
            query($id: ID!) {
                currencys {
                    name
                    cn
                }
                ledger(id: $id) {
                    title
                    classifies {
                        _id
                        text
                        icon
                        color
                    }
                    members {
                        _id
                        name
                    }
                }
            }
        `,
        { variables: { id }, fetchPolicy: 'cache-and-network' }
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
            {format(
                new Date(timeTransform.toLocal(getValues().datetime!)),
                config.dateFormat
            )}
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
            {format(
                new Date(timeTransform.toLocal(getValues().datetime!)),
                config.timeFormat
            )}
        </Button>
    )

    const [createRecord] = useMutation<
        {
            createRecord: IReport
        },
        {
            data: ICreateRecord
        }
    >(
        gql`
            mutation($data: CreateRecord) {
                createRecord(data: $data) {
                    code
                    message
                }
            }
        `,
        {
            onError: onApolloError,
            onCompleted() {
                notification.success({
                    content: '创建成功'
                })
                history.push(`/ledger/${id}`)
            }
        }
    )

    const onSubmit = () => {
        createRecord({ variables: { data: getValues() } })
    }

    const checkGhost = () => {
        const members = (data && data.ledger && data.ledger.members) || []
        return (
            checkMembers(members, getValues().payer || []) &&
            checkMembers(members, getValues().participator || []) &&
            checkMembers(members, getValues().settled || [])
        )
    }

    const clearGhost = () => {
        const members = (data && data.ledger && data.ledger.members) || []

        const filter = (arr: string[] = []) => {
            return arr.filter(v => {
                return !!members.find(member => member._id === v)
            })
        }
        setValue('payer', filter(getValues().payer), true)
        setValue('participator', filter(getValues().participator), true)
        setValue('settled', filter(getValues().settled), true)
    }

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle={data && data.ledger && data.ledger.title || ''}
                left={<BackButton icon="close" href={`/ledger/${id}`} />}
                right={
                    <Button
                        color="default"
                        size="medium"
                        style={{ fontSize: '1.6em' }}
                        onClick={handleSubmit(onSubmit)}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            />
            <ContentBody>
                <Grid container gap={2}>
                    {/* type */}
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
                                        getValues().type === item.value
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    color="primary"
                                    size="small"
                                    border="round"
                                    key={item.value}
                                    onClick={() => {
                                        setValue('type', item.value, true)
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

                    <Grid
                        container
                        gap={2}
                        alignItems="center"
                        className={styles.amount}
                    >
                        <Grid>
                            {/* Currency */}
                            <Button onClick={() => setShowCurrency(true)}>
                                {getValues().currency}
                            </Button>

                            <Popup
                                show={showCurrency}
                                onClose={() => setShowCurrency(false)}
                                header
                                title="选择货币种类"
                                contentPadding
                            >
                                {data &&
                                    data.currencys &&
                                    data.currencys.map(item => (
                                        <Button
                                            type={
                                                item.name ===
                                                getValues().currency
                                                    ? 'contained'
                                                    : 'outlined'
                                            }
                                            color={
                                                item.name ===
                                                getValues().currency
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                            border="round"
                                            size="large"
                                            key={item.name}
                                            onClick={() => {
                                                setValue(
                                                    'currency',
                                                    item.name,
                                                    true
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
                                value={getValues().amount}
                                onClick={() => setCalculatorShow(true)}
                            />
                            <Calculator
                                value={getValues().amount}
                                onUpdate={value =>
                                    setValue('amount', value, true)
                                }
                                show={calculatorShow}
                                onBlur={() => setCalculatorShow(false)}
                            />
                        </Grid>
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

                {/* classify */}
                <ClassifyPicker
                    data={(data && data.ledger && data.ledger.classifies) || []}
                    active={getValues().classify || ''}
                    onChange={value => setValue('classify', value, true)}
                />
                <Grid container gap={2}>
                    <Grid sm={12}>
                        <Input.Helper error>
                            {errors.classify && errors.classify.message}
                        </Input.Helper>
                    </Grid>
                </Grid>

                <Grid container gap={2}>
                    {/* detail */}
                    <Grid sm={12}>
                        <Input.Control error={!!errors.detail}>
                            <Input.Label htmlFor="detail">描述</Input.Label>
                            <Input.TextArea
                                name="detail"
                                id="detail"
                                value={getValues().detail}
                                onChange={e =>
                                    setValue('detail', e.target.value, true)
                                }
                                autosize
                            />
                            <Input.Helper>
                                {errors.detail && errors.detail.message}
                            </Input.Helper>
                        </Input.Control>
                    </Grid>

                    {/* datetime */}
                    <Grid sm={12}>
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
                    </Grid>

                    <DatePicker.Modal
                        show={showDate}
                        onClickOverlay={() => setShowDate(false)}
                    >
                        <DatePicker.DatePicker
                            value={
                                new Date(
                                    timeTransform.toLocal(getValues().datetime!)
                                )
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
                                new Date(
                                    timeTransform.toLocal(getValues().datetime!)
                                )
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

                    {/* member */}
                    <Grid sm={12}>
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
                                    payer: getValues().payer,
                                    participator: getValues().participator,
                                    settled: getValues().settled
                                },
                                (data && data.ledger && data.ledger.members) ||
                                    []
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
                    </Grid>
                </Grid>
            </ContentBody>
        </>
    )
}

export default LedgerAdd

function checkMembers(members: ILedger['members'] = [], ids: string[]) {
    return !ids.find(id => {
        return !members.find(member => member._id === id)
    })
}
