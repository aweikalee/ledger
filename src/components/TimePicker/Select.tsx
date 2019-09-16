import React, { useRef, useState, useEffect, useCallback } from 'react'
import scrollTo from '../utils/scrollTo'
import useFirstRun from '../utils/useFirstRun'
import useResizeObserver from '../utils/useResizeObserver'
import styles from './TimePicker.module.scss'
import { debounceFactory } from '@/utils/debounce'

export interface ITimePickerSelectProps {
    min?: number
    max?: number
    step?: number
    selected?: number
    onUpdate?: (value: number) => void
}

const TimePickerSelect: React.FC<ITimePickerSelectProps> = props => {
    const {
        min = 0,
        max = 60,
        step = 1,
        selected,
        onUpdate = () => {}
    }: typeof props = props

    const getList = useCallback(() => {
        const arr = []
        for (let i = min; i < max + 1; i += step) {
            arr.push(i)
        }
        return arr
    }, [min, max, step])
    const [list, setList] = useState<number[]>(getList)
    const listRef = useRef(list)
    const isFirstRun = useFirstRun()
    useEffect(() => {
        if (!isFirstRun.current) {
            const arr = getList()
            setList(arr)
            listRef.current = arr
        }
    }, [getList, isFirstRun])

    /* 滚动至selected项 */
    const ref = useRef<HTMLUListElement>(null)
    const colRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const selectedRef = useRef(selected)
    const scrollToSelected = useCallback(() => {
        if (ref.current) {
            const target = ref.current.children[
                listRef.current.indexOf(selectedRef.current!)
            ] as HTMLElement
            if (target && colRef.current) {
                scrollTo(colRef.current, target.offsetTop, 150)
            }
        }
    }, [ref, listRef, selectedRef])
    useEffect(() => {
        selectedRef.current = selected
        scrollToSelected()
    }, [selected, scrollToSelected])

    const onResize = useCallback(debounceFactory(scrollToSelected, 100), [
        scrollToSelected
    ])
    useResizeObserver(wrapperRef, onResize)

    /* 控制overflow-y状态（移动端） */
    const [hover, setHover] = useState(false)
    const hoverTimer = useRef<NodeJS.Timeout>()
    useEffect(() => {
        return () => {
            if (hoverTimer.current) {
                clearTimeout(hoverTimer.current)
            }
        }
    }, [hoverTimer])
    const onTouchStart = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        setHover(true)
    }
    const onTouchEnd = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        hoverTimer.current = setTimeout(() => {
            setHover(false)
        }, 3000)
    }

    return (
        <div
            data-role="timepicker-select"
            className={styles.select}
            ref={wrapperRef}
        >
            <div
                data-role="timepicker-col"
                data-hover={hover}
                ref={colRef}
                onTouchStart={onTouchStart}
                onTouchCancel={onTouchEnd}
                onTouchEnd={onTouchEnd}
            >
                <ul data-role="timepicker-ul" ref={ref}>
                    {list.map(value => (
                        <li
                            data-role="timepicker-li"
                            data-selected={selected === value}
                            key={value}
                            onClick={() => {
                                onUpdate(value)
                            }}
                            tabIndex={-1}
                        >
                            {value < 10 ? `0${value}` : value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default TimePickerSelect
