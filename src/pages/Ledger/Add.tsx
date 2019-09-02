import React, { useState } from 'react'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator, {
    ICalculatorProps
} from '@/components/Calculator/Calculator'

const LedgerAdd: React.FC = props => {
    const [forms, setForms] = useState({
        amount: '0'
    })

    const onAmountUpdate: ICalculatorProps['onUpdate'] = res => {
        setForms({
            ...forms,
            amount: res
        })
    }

    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton href="/" />}
            />
            <ContentBody>
                <Calculator
                    value={forms.amount}
                    onUpdate={onAmountUpdate}
                    autofocus
                />
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerAdd
