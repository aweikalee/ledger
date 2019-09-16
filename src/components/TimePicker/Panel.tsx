import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Select, { ITimePickerSelectProps } from './Select'
import styles from './TimePicker.module.scss'

export interface ITimePickerPanelProps
    extends React.HTMLAttributes<HTMLDivElement> {
    value?: Date
    disabledHours?: boolean
    disabledMinutes?: boolean
    disabledSeconds?: boolean
    hourStep?: number
    minuteStep?: number
    secondStep?: number
    onUpdate?: (value: Date) => void
}

const TimePickerPanel: React.FC<ITimePickerPanelProps> = props => {
    const {
        className: classNameProp,
        value: valueProp = new Date(),
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        hourStep = 1,
        minuteStep = 1,
        secondStep = 1,
        onUpdate = () => {},
        ...other
    }: typeof props = props

    const [date, setDate] = useState<Date>(valueProp)
    useEffect(() => {
        const _date = new Date(valueProp.valueOf())
        if (!disabledHours) {
            _date.setHours(Math.floor(_date.getHours() / hourStep) * hourStep)
        }
        if (!disabledMinutes) {
            _date.setMinutes(
                Math.floor(_date.getMinutes() / minuteStep) * minuteStep
            )
        }
        if (!disabledSeconds) {
            _date.setSeconds(
                Math.floor(_date.getSeconds() / secondStep) * secondStep
            )
        }
        setDate(_date)
    }, [
        valueProp,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        hourStep,
        minuteStep,
        secondStep
    ])

    const onUpdateHours: ITimePickerSelectProps['onUpdate'] = value => {
        if (!disabledHours) {
            setDate(date => {
                const _date = new Date(date.valueOf())
                _date.setHours(value)
                onUpdate(_date)
                return _date
            })
        }
    }
    const onUpdateMinutes: ITimePickerSelectProps['onUpdate'] = value => {
        if (!disabledMinutes) {
            setDate(date => {
                const _date = new Date(date.valueOf())
                _date.setMinutes(value)
                onUpdate(_date)
                return _date
            })
        }
    }
    const onUpdateSeconds: ITimePickerSelectProps['onUpdate'] = value => {
        if (!disabledSeconds) {
            setDate(date => {
                const _date = new Date(date.valueOf())
                _date.setSeconds(value)
                onUpdate(_date)
                return _date
            })
        }
    }

    const className = clsx(styles.panel, classNameProp)
    const bindProps: React.HTMLAttributes<HTMLElement> = {
        className,
        ...other
    }

    return (
        <div data-role="timepicker" {...bindProps}>
            {!disabledHours && (
                <Select
                    max={23}
                    step={hourStep}
                    selected={date.getHours()}
                    onUpdate={onUpdateHours}
                />
            )}
            {!disabledMinutes && (
                <Select
                    max={59}
                    step={minuteStep}
                    selected={date.getMinutes()}
                    onUpdate={onUpdateMinutes}
                />
            )}
            {!disabledSeconds && (
                <Select
                    max={59}
                    step={secondStep}
                    selected={date.getSeconds()}
                    onUpdate={onUpdateSeconds}
                />
            )}
        </div>
    )
}
export default TimePickerPanel
