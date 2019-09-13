import React, { useState } from 'react'
import useForm from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import { Popup } from '@/components/Popup'
import * as valid from '@/utils/valid'
import BigNumberOrigin from 'bignumber.js'
import Button from '@/components/Button'
import * as Input from '@/components/Input'
import Grid from '@/components/Grid'
import TypePicker from './components/TypePicker'
import { IRecordType } from './components/Record'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface ICurrency {
    name: string
    cn: string
}

export interface IForm {
    amount?: string
    currency?: string
    type?: string
    detail?: string
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
    const [forms, setForms] = useState<IForm>({
        amount: '0',
        currency: 'CNY',
        type: ''
    })
    const { register, setValue, triggerValidation } = useForm<IForm>(
        {
            mode: 'onChange',
            defaultValues: {
                amount: forms.amount,
                currency: forms.currency,
                type: forms.type,
                detail: ''
            }
        }
    )

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
                name: 'type'
            },
            {
                validate: value => {
                    return valid.queue<string>([valid.isRequire()], {
                        name: '类型'
                    })(value)
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

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton href="/" />}
            />
            <ContentBody>
                {/* Currency */}
                <Button onClick={() => setShowCurrency(true)}>
                    {forms.currency}
                </Button>
                <Popup
                    show={showCurrency}
                    onClickOverlay={() => setShowCurrency(false)}
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
                                    updateForms('currency', item.name)
                                    setShowCurrency(false)
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                </Popup>

                {/* Amount */}
                <ScreenMini
                    value={forms.amount}
                    onClick={() => setCalculatorShow(true)}
                ></ScreenMini>
                <Calculator
                    value={forms.amount}
                    onUpdate={value => updateForms('amount', value)}
                    show={calculatorShow}
                    onBlur={() => setCalculatorShow(false)}
                />

                {/* type */}
                <TypePicker
                    data={dataTypes ? dataTypes.recordTypes : []}
                    active={forms.type || ''}
                    onChange={value => updateForms('type', value)}
                />

                <Grid container gap={2}>
                    {/* detail */}
                    <Grid item sm={12}>
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
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerAdd
