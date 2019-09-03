import React, { useState } from 'react'
import useForm from 'react-hook-form'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator, {
    ICalculatorProps
} from '@/components/Calculator/Calculator'
import { ScreenMini } from '@/components/Calculator'
import * as valid from '@/utils/valid'
import BigNumberOrigin from 'bignumber.js'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

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

    const [calculatorShow, setCalculatorShow] = useState(true)

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton href="/" />}
            />
            <ContentBody>
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
