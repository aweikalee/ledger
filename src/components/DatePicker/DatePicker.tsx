import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './DatePicker.module.scss'
import Button from '../Button'
import Grid from '../Grid'
import Panel from './Panel'
import { format } from 'date-fns'

export interface IDatePickerProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: Date
    min?: Date
    max?: Date

    // Display
    yearStep?: number
    monthStep?: number
    dayStep?: number
    hourStep?: number
    minuteStep?: number
    secondStep?: number

    // Status
    disabledYears?: boolean
    disabledMonths?: boolean
    disabledDays?: boolean
    disabledHours?: boolean
    disabledMinutes?: boolean
    disabledSeconds?: boolean

    // Event
    onUpdate?: (value: Date) => void
    onConfirm?: (value: Date) => void
}

// 默认的最小值和最大值 为当天时间 ±50年
let DEFAULT_MIN: Date
let DEFAULT_MAX: Date
;(() => {
    const now = Date.now()

    const min = new Date(now)
    const max = new Date(now)

    min.setFullYear(min.getFullYear() - 50)
    max.setFullYear(max.getFullYear() + 50)

    DEFAULT_MIN = min
    DEFAULT_MAX = max
})()

const Component = React.forwardRef<HTMLElement, IDatePickerProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value: valueProps,
            min = DEFAULT_MIN,
            max = DEFAULT_MAX,

            // Display
            yearStep,
            monthStep,
            dayStep,
            hourStep,
            minuteStep,
            secondStep,

            // Status
            disabledYears,
            disabledMonths,
            disabledDays,
            disabledHours,
            disabledMinutes,
            disabledSeconds,

            // Event
            onUpdate,
            onConfirm,

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const [value, setValue] = useState(() => valueProps || new Date())
        useEffect(() => {
            /* 超过最值 则将组件内的值设为最值 不提交 */
            let _value = valueProps || new Date()
            _value = _value > min ? _value : min
            _value = _value < max ? _value : max
            _value = cloneDate(_value)

            setValue(_value)
        }, [valueProps, min, max])

        const step = {
            yearStep,
            monthStep,
            dayStep,
            hourStep,
            minuteStep,
            secondStep
        }
        const disabled = {
            disabledYears,
            disabledMonths,
            disabledDays,
            disabledHours,
            disabledMinutes,
            disabledSeconds
        }

        const className = clsx(styles.datepicker, classNameProp)
        const bindProps = {
            className,
            ...other
        }

        return (
            <div data-role="datepicker" ref={el} {...bindProps}>
                <Grid
                    data-role="datepicker-header"
                    container
                    justify="space-between"
                    alignItems="center"
                >
                    {displayRenderer(value, disabled)}
                </Grid>

                <Panel
                    value={value}
                    min={min}
                    max={max}
                    onUpdate={v => {
                        setValue(v)
                        onUpdate && onUpdate(v)
                    }}
                    {...disabled}
                    {...step}
                ></Panel>

                <div data-role="datepicker-footer">
                    <Button
                        type="contained"
                        color="primary"
                        size="large"
                        block
                        onClick={() => onConfirm && onConfirm(value)}
                    >
                        确定
                    </Button>
                </div>
            </div>
        )
    }
)

Component.displayName = 'DatePicker'
export default Component

function cloneDate(date: Date) {
    return new Date(date.valueOf())
}

function displayRenderer(
    value: Date,
    {
        disabledYears,
        disabledMonths,
        disabledDays,
        disabledHours,
        disabledMinutes,
        disabledSeconds
    }: {
        disabledYears?: boolean
        disabledMonths?: boolean
        disabledDays?: boolean
        disabledHours?: boolean
        disabledMinutes?: boolean
        disabledSeconds?: boolean
    }
) {
    const year = !disabledYears
    const month = !disabledMonths
    const day = !disabledDays
    const hour = !disabledHours
    const minute = !disabledMinutes
    const second = !disabledSeconds
    const date = month || day
    const time = hour || minute || second
    if ((year || date) === time) {
        return (
            <>
                <Grid direction="column">
                    {year && (
                        <Grid
                            data-role="datepicker-header-text"
                            data-size={date ? 'small' : 'large'}
                        >
                            {format(value, 'yyyy')}
                        </Grid>
                    )}
                    {date && (
                        <Grid
                            data-role="datepicker-header-text"
                            data-size={year ? 'medium' : 'large'}
                        >
                            {format(
                                value,
                                getFormat({
                                    month,
                                    day
                                })
                            )}
                        </Grid>
                    )}
                </Grid>
                <Grid data-role="datepicker-header-text" data-size="large">
                    {format(
                        value,
                        getFormat({
                            hour,
                            minute,
                            second
                        })
                    )}
                </Grid>
            </>
        )
    } else {
        return (
            <Grid data-role="datepicker-header-text" data-size="large">
                {format(
                    value,
                    getFormat({
                        year,
                        month,
                        day,
                        hour,
                        minute,
                        second
                    })
                )}
            </Grid>
        )
    }
}

function getFormat({
    year,
    month,
    day,
    hour,
    minute,
    second
}: {
    year?: boolean
    month?: boolean
    day?: boolean
    hour?: boolean
    minute?: boolean
    second?: boolean
}) {
    const date = []
    const time = []

    year && date.push('yyyy')
    month && date.push('MM')
    day && date.push('dd')
    hour && time.push('HH')
    minute && time.push('mm')
    second && time.push('ss')

    const result = []
    date.length > 0 && result.push(date.join('-'))
    time.length > 0 && result.push(time.join(':'))

    return result.join(' ')
}
