import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'
import Panel, { ITimePickerPanelProps } from './Panel'
import styles from './TimePicker.module.scss'
import Button from '../Button'

export interface ITimePickerProps extends ITimePickerPanelProps {
    onConfirm?: (value: Date) => void
}

const TimePicker: React.FC<ITimePickerProps> = props => {
    const {
        className: classNameProp,
        value: valueProp = new Date(),
        onUpdate: onUpdateProp = () => {},
        onConfirm: onConfirmProp = () => {},
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        ...other
    }: typeof props = props

    const [date, setDate] = useState<Date>(valueProp)
    useEffect(() => {
        setDate(valueProp)
    }, [valueProp])

    const [dateFormat, setDateFormat] = useState('HH:mm:ss')
    useEffect(() => {
        const arr = []
        if (!disabledHours) {
            arr.push('HH')
        }
        if (!disabledMinutes) {
            arr.push('mm')
        }
        if (!disabledSeconds) {
            arr.push('ss')
        }
        setDateFormat(arr.join(':'))
    }, [disabledHours, disabledMinutes, disabledSeconds])

    const onUpdate: ITimePickerProps['onUpdate'] = value => {
        setDate(value)
        onUpdateProp(value)
    }

    const onConfirm = () => {
        onConfirmProp(date)
    }

    const className = clsx(styles.timepicker, classNameProp)
    const bindProps = {
        value: date,
        onUpdate,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        ...other
    }

    return (
        <div data-role="timepicker" className={className}>
            <div data-role="timepicker-screen">{format(date, dateFormat)}</div>
            <Panel {...bindProps} />
            <div data-role="timepicker-footer">
                <Button
                    type="contained"
                    color="primary"
                    size="large"
                    block
                    onClick={onConfirm}
                >
                    确定
                </Button>
            </div>
        </div>
    )
}
export default TimePicker
