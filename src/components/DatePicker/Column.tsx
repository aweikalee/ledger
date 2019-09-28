import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import ReactList from 'react-list'
import styles from './DatePicker.module.scss'
import * as Select from '../Select'
import { getScrollBarWidth } from '../utils/scrollBar'
import scrollTo from '../utils/scrollTo'
import { ISelectColumnProps } from '../Select/Column'

export interface IDatePickerColumnProps
    extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: number
    min?: number
    max?: number
    step?: number

    // Dispaly
    format?: (value: number) => string | number
    label?: string

    // Event
    onUpdate?: (value: number) => void
}

const Component = React.forwardRef<HTMLElement, IDatePickerColumnProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value,
            min = 1,
            max = 7,
            step = 1,

            // Dispaly
            format,
            label,

            // Event
            onUpdate,

            //Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const elList = useRef<ReactList>(null)

        const [list, setList] = useState<number[]>([])
        useEffect(() => {
            const result: number[] = []
            for (let i = 0; i <= max; i += step) {
                if (i >= min) {
                    result.push(i)
                }
            }
            setList(result)
        }, [min, max, step, format])
        const itemRenderer: ISelectColumnProps['itemRenderer'] = index => {
            const v = list[index]
            return (
                <Select.Option align="center" value={v} key={v}>
                    {format ? format(v) : v}
                </Select.Option>
            )
        }

        /* 滚动至选中目标 */
        const [resize, setResize] = useState(false)
        useEffect(() => {
            const index = list.indexOf(value!)
            if (index !== -1 && elList.current) {
                const current = elList.current
                const scrollTop = current.getSpaceBefore(index)
                scrollTo(el.current!, scrollTop, 150)
            }
        }, [value, list, resize])

        const className = clsx(styles.column, classNameProp)
        const bindProps = {
            value,
            'aria-label': label,
            filler: true,
            onUpdate,
            ...other
        } as ISelectColumnProps

        return (
            <div data-role="datepicker-column" className={className}>
                <div
                    data-role="detepicker-label"
                    aria-label={label}
                    style={{ paddingRight: getScrollBarWidth() }}
                >
                    {label}
                </div>
                <Select.Column
                    ref={el}
                    listRef={elList}
                    length={list.length}
                    itemRenderer={itemRenderer}
                    onResize={() => setResize(v => !v)}
                    {...bindProps}
                />
            </div>
        )
    }
)

Component.displayName = 'DatePickerColumn'
export default Component
