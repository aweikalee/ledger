import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './DatePicker.module.scss'
import * as Select from '../Select'
import { getScrollBarWidth } from '../utils/scrollBar'
import scrollTo, { getOffsetScrollTop } from '../utils/scrollTo'
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

        const [list, setList] = useState<number[]>([])
        const [listNode, setListNode] = useState<React.ReactNode>()
        useEffect(() => {
            const result = []
            for (let i = min; i <= max; i += step) {
                result.push(i)
            }
            setList(result)
            setListNode(
                result.map(v => {
                    return (
                        <Select.Option align="center" value={v} key={v}>
                            {format ? format(v) : v}
                        </Select.Option>
                    )
                })
            )
        }, [min, max, step, format])

        /* 滚动至选中目标 */
        useEffect(() => {
            const index = list.indexOf(value!)
            if (index !== -1 && el.current) {
                const scrollTop = getOffsetScrollTop(
                    el.current,
                    el.current.children[index]
                )
                scrollTo(el.current, scrollTop, 150)
            }
        }, [value, list])

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
                <Select.Column ref={el} {...bindProps}>
                    {listNode}
                </Select.Column>
            </div>
        )
    }
)

Component.displayName = 'DatePickerColumn'
export default Component
