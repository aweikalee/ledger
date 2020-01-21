import React from 'react'
import { format } from 'date-fns'

import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import * as DatePicker from '@/components/DatePicker'

import context from './context'

const IndexDatePicker: React.FC = props => {
    const { datetime, setDatetime } = React.useContext(context)
    const [show, setShow] = React.useState(false)
    return (
        <>
            <Button
                type="text"
                color="default"
                size="small"
                onClick={() => setShow(true)}
            >
                <Icon
                    text="calendar"
                    style={{ fontSize: '1.3em' }}
                ></Icon>
                {format(datetime, 'yyyy年MM月')}
            </Button>

            <DatePicker.Modal show={show} onClickOverlay={() => setShow(false)}>
                <DatePicker.DatePicker
                    value={new Date(datetime)}
                    onConfirm={value => {
                        setDatetime(value.getTime())
                        setShow(false)
                    }}
                    disabledDays
                    disabledHours
                    disabledMinutes
                    disabledSeconds
                ></DatePicker.DatePicker>
            </DatePicker.Modal>
        </>
    )
}

export default IndexDatePicker
