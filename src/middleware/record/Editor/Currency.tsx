import React from 'react'

import Popup from '@/components/Popup'
import { Button } from '@/components/Button'

import { IRecord } from '@/model/types/record'
import { ICurrency } from '@/model/types/currency'

const Currency: React.FC<{
    value: IRecord['currency']
    currencies: ICurrency[]
    onUpdate: (value: IRecord['currency']) => void
}> = props => {
    const { value, currencies, onUpdate } = props

    const [show, setShow] = React.useState(false)

    return (
        <>
            <Button onClick={() => setShow(true)}>{value}</Button>

            <Popup
                show={show}
                onClose={() => setShow(false)}
                header
                title="选择货币种类"
                contentPadding
            >
                {currencies.map(item => (
                    <Button
                        type={item.name === value ? 'contained' : 'outlined'}
                        color={item.name === value ? 'primary' : 'default'}
                        border="round"
                        size="large"
                        key={item.name}
                        onClick={() => {
                            onUpdate(item.name)
                            setShow(false)
                        }}
                    >
                        {item.name}
                    </Button>
                ))}
            </Popup>
        </>
    )
}

export default Currency
