import React, { useState, useEffect } from 'react'
import useForm from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator, {
    ICalculatorProps
} from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import { Popup } from '@/components/Popup'
import * as valid from '@/utils/valid'
import BigNumberOrigin from 'bignumber.js'
import Button from '@/components/Button'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

export interface ICurrency {
    name: string
    cn: string
}

export interface IForm {
    amount?: string
    lastname?: string
    firstname?: string
}

const LedgerAdd: React.FC = props => {
    const [forms, setForms] = useState<IForm>({
        amount: '0'
    })
    const { register, errors, setValue, triggerValidation } = useForm<IForm>({
        mode: 'onChange',
        defaultValues: {
            amount: forms.amount,
            lastname: '',
            firstname: ''
        }
    })

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
    }, [register])

    const onAmountUpdate: ICalculatorProps['onUpdate'] = res => {
        setValue('amount', res)
        setForms({
            ...forms,
            amount: res
        })
        triggerValidation([{ name: 'amount' }])
    }

    const [calculatorShow, setCalculatorShow] = useState(false)

    /* Currency */
    const [showCurrency, setShowCurrency] = useState(true)
    const [activeCurrency, setActiveCurrency] = useState('CNY')
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

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton href="/" />}
            />
            <ContentBody>
                <Button onClick={() => setShowCurrency(true)}>
                    {activeCurrency}
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
                                    item.name === activeCurrency
                                        ? 'contained'
                                        : 'outlined'
                                }
                                color={
                                    item.name === activeCurrency
                                        ? 'primary'
                                        : 'default'
                                }
                                border="round"
                                size="large"
                                key={item.name}
                                onClick={() => {
                                    setActiveCurrency(item.name)
                                    setShowCurrency(false)
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                </Popup>

                <ScreenMini
                    value={forms.amount}
                    onClick={() => setCalculatorShow(true)}
                ></ScreenMini>
                <Calculator
                    value={forms.amount}
                    onUpdate={onAmountUpdate}
                    show={calculatorShow}
                    onBlur={() => setCalculatorShow(false)}
                />
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerAdd
