import React from 'react'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Calculator from '@/components/Calculator'

const LedgerAdd: React.FC = props => {
    return (
        <>
            <NavigationBar
                title="新增账单"
                subTitle="旅行账簿"
                left={<BackButton href="/" />}
            />
            <ContentBody>
                <Calculator autofocus />
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerAdd
