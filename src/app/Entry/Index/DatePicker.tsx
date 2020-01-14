import React from 'react'
import { format } from 'date-fns'

import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import * as DatePicker from '@/components/DatePicker'

const IndexDatePicker: React.FC<{
    datetime: number
    setDatetime: (value: number) => void
}> = props => {
    const { datetime, setDatetime } = props
    const [showDate, setShowDate] = React.useState(false)
    return (
        <>
            <Button
                type="text"
                color="default"
                size="small"
                onClick={() => setShowDate(true)}
            >
                <Icon text="calendar"></Icon>
                {format(datetime, 'yyyy年MM月')}
            </Button>

            <DatePicker.Modal
                show={showDate}
                onClickOverlay={() => setShowDate(false)}
            >
                <DatePicker.DatePicker
                    value={new Date(datetime)}
                    onConfirm={value => {
                        setDatetime(value.getTime())
                        setShowDate(false)
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
