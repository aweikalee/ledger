import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './DatePicker.module.scss'
import Column from './Column'

export interface IDatePickerPanelProps
    extends React.HTMLAttributes<HTMLElement> {
    // Value
    value: Date
    min: Date
    max: Date

    // Status
    disabledYears?: boolean
    disabledMonths?: boolean
    disabledDays?: boolean
    disabledHours?: boolean
    disabledMinutes?: boolean
    disabledSeconds?: boolean

    // Event
    onUpdate?: (value: Date) => void
}

export interface ILimit {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
}

const Component = React.forwardRef<HTMLElement, IDatePickerPanelProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value,
            min: minProp,
            max: maxProp,

            // Status
            disabledYears,
            disabledMonths,
            disabledDays,
            disabledHours,
            disabledMinutes,
            disabledSeconds,

            // Event
            onUpdate = () => {},

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        /* 设定各列的最值 */
        const [min, setMin] = useState<ILimit>(getDefaultLimit)
        const [max, setMax] = useState<ILimit>(getDefaultLimit)

        useEffect(() => {
            const lastDay = getMouthLastDay(
                value.getFullYear(),
                value.getMonth() + 1
            )

            const resultMin = mergeAndPickerValues(
                dateToArray(value),
                dateToArray(minProp),
                [minProp.getFullYear(), 0, 1, 0, 0, 0]
            )
            const resultMax = mergeAndPickerValues(
                dateToArray(value),
                dateToArray(maxProp),
                [maxProp.getFullYear(), 11, lastDay, 23, 59, 59]
            )

            setMin(dateArrayToObject(resultMin))
            setMax(dateArrayToObject(resultMax))
        }, [value, minProp, maxProp])

        const className = clsx(styles.panel, classNameProp)
        const bindProps = {
            className,
            ...other
        }

        return (
            <div data-role="datapicker-panel" {...bindProps}>
                {disabledYears || (
                    <Column
                        label="年"
                        min={min.year}
                        max={max.year}
                        value={value.getFullYear()}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            date.setFullYear(v)
                            onUpdate(date)
                        }}
                    />
                )}
                {disabledMonths || (
                    <Column
                        label="月"
                        min={min.month + 1}
                        max={max.month + 1}
                        value={value.getMonth() + 1}
                        format={supplementaryZero}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            const lastDay = getMouthLastDay(
                                date.getFullYear(),
                                v
                            )
                            if (date.getDate() > lastDay) {
                                date.setDate(lastDay)
                            }
                            date.setMonth(v - 1)
                            onUpdate(date)
                        }}
                    />
                )}
                {disabledDays || (
                    <Column
                        label="日"
                        min={min.day}
                        max={max.day}
                        value={value.getDate()}
                        format={supplementaryZero}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            date.setDate(v)
                            onUpdate(date)
                        }}
                    />
                )}
                {disabledHours || (
                    <Column
                        label="时"
                        min={min.hour}
                        max={max.hour}
                        value={value.getHours()}
                        format={supplementaryZero}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            date.setHours(v)
                            onUpdate(date)
                        }}
                    />
                )}
                {disabledMinutes || (
                    <Column
                        label="分"
                        min={min.minute}
                        max={max.minute}
                        value={value.getMinutes()}
                        format={supplementaryZero}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            date.setMinutes(v)
                            onUpdate(date)
                        }}
                    />
                )}
                {disabledSeconds || (
                    <Column
                        label="秒"
                        min={min.second}
                        max={max.second}
                        value={value.getSeconds()}
                        format={supplementaryZero}
                        onUpdate={v => {
                            const date = cloneDate(value)
                            date.setSeconds(v)
                            onUpdate(date)
                        }}
                    />
                )}
            </div>
        )
    }
)

Component.displayName = 'DatePickerPanel'
export default Component

function cloneDate(date: Date) {
    return new Date(date.valueOf())
}

const MONTH_LAST_DAY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function getMouthLastDay(year: number, month: number) {
    if (month === 2) {
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            return 29
        } else {
            return 28
        }
    } else {
        return MONTH_LAST_DAY[month - 1]
    }
}

function supplementaryZero(value: number) {
    return value > 9 ? `${value}` : `0${value}`
}

/* ========== 设定min 和max所使用的一些函数 ========== */

function getDefaultLimit() {
    return {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    }
}

function dateToArray(date: Date) {
    return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ]
}

/** 参数通过 dateToArray 获得
 * @value props.value
 * @limit props.min / props.max
 * @defaultLimit 基础值，value[0]和limit[0]相等时则会使用limit[1]覆盖defaultLimit[1]；以此类推
 */
function mergeAndPickerValues(
    value: number[],
    limit: number[],
    defaultLimit: number[]
) {
    const result = [...defaultLimit]
    for (let i = 1; i < value.length; i += 1) {
        if (limit[i - 1] === value[i - 1]) {
            result[i] = limit[i]
        } else {
            break
        }
    }

    return result
}

/** 将 dateToArray 形式的数组转换成更容易阅读的对象 */
function dateArrayToObject(array: number[]) {
    const result: ILimit = {} as ILimit
    const keys: (keyof ILimit)[] = [
        'year',
        'month',
        'day',
        'hour',
        'minute',
        'second'
    ]
    for (let i = 0; i < keys.length; i += 1) {
        result[keys[i]] = array[i]
    }
    return result
}
