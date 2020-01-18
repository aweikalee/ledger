import React from 'react'
import { format } from 'date-fns'

import { Button } from '@/components/Button'
import * as Input from '@/components/Input'
import * as DatePicker from '@/components/DatePicker'

import config from '@/config'
import { IRecord } from '@/model/types/record'

const Datetime: React.FC<{
    value: IRecord['datetime']
    onUpdate: (value: IRecord['datetime']) => void
}> = props => {
    const { value, onUpdate } = props

    const [showDate, setShowDate] = React.useState(false)
    const [showTime, setShowTime] = React.useState(false)

    const date = React.useMemo(() => new Date(value || Date.now()), [value])

    return (
        <>
            <Input.Input
                name="datetime"
                id="datetime"
                disabled
                before={
                    <Button
                        type="text"
                        color="default"
                        size="medium"
                        block
                        onClick={() => setShowDate(true)}
                    >
                        {format(date, config.dateFormat)}
                    </Button>
                }
                after={
                    <Button
                        type="text"
                        color="default"
                        size="medium"
                        block
                        onClick={() => setShowTime(true)}
                    >
                        {format(date, config.timeFormat)}
                    </Button>
                }
            />

            <DatePicker.Modal
                show={showDate}
                onClickOverlay={() => setShowDate(false)}
            >
                <DatePicker.DatePicker
                    value={date}
                    onConfirm={value => {
                        onUpdate(value.getTime())
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
                    value={date}
                    onConfirm={value => {
                        onUpdate(value.getTime())
                        setShowTime(false)
                    }}
                    disabledYears
                    disabledMonths
                    disabledDays
                ></DatePicker.DatePicker>
            </DatePicker.Modal>
        </>
    )
}

export default Datetime
