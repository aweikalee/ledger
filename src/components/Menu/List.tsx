import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { getScrollBarWidth } from '../utils/scrollBar'
import styles from './Menu.module.scss'

export interface IMenuListProps extends React.HTMLAttributes<HTMLElement> {}

const MenuList = React.forwardRef<HTMLElement, IMenuListProps>((props, ref) => {
    const {
        className: classNameProp,
        children,

        // Events
        onTouchStart: onTouchStartProp,
        onTouchEnd: onTouchEndProp,

        // Other
        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    /* 键盘操作 */
    const onKeyDown: IMenuListProps['onKeyDown'] = e => {
        if (!el.current) {
            return
        }

        const key = e.key
        const activeElement = (el.current.ownerDocument || document)
            .activeElement!

        if (key === 'ArrowDown') {
            e.preventDefault()
            moveFocus(el.current, activeElement, nextItem)
        } else if (key === 'ArrowUp') {
            moveFocus(el.current, activeElement, prevItem)
            e.preventDefault()
        } else if (key === 'Home') {
            e.preventDefault()
            moveFocus(el.current, undefined, nextItem)
        } else if (key === 'End') {
            e.preventDefault()
            moveFocus(el.current, undefined, prevItem)
        } else if (key === ' ' || key === 'Enter') {
            e.preventDefault()
            if (activeElement) {
                ;(activeElement as HTMLElement).click()
            }
        }
    }

    /* 控制overflow-y状态（移动端） */
    const [hover, setHover] = useState(false)
    const hoverTimer = useRef<NodeJS.Timeout>()
    useEffect(
        () => () => {
            if (hoverTimer.current) {
                clearTimeout(hoverTimer.current)
            }
        },
        [hoverTimer]
    )
    const onTouchStart: IMenuListProps['onTouchStart'] = e => {
        if (onTouchStartProp) {
            onTouchStartProp(e)
        }
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        setHover(true)
    }
    const onTouchEnd: IMenuListProps['onTouchEnd'] = e => {
        if (onTouchEndProp) {
            onTouchEndProp(e)
        }
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        hoverTimer.current = setTimeout(() => {
            setHover(false)
        }, 3000)
    }

    /* 使其他软件能认为该组件是滚动容器，所以等初始完后再将overflow-y设为hidden */
    const [ready, setReady] = useState(false)
    useEffect(() => {
        const timer = requestAnimationFrame(() => {
            setReady(true)
        })
        return () => {
            cancelAnimationFrame(timer)
        }
    }, [])

    /* 防止滚动条出现/消失产生的抖动 */
    const paddingRight = getScrollBarWidth()
    const items = React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return null
        }
        if (child.type === React.Fragment) {
            return child
        }

        return React.cloneElement(child, {
            style: {
                paddingRight
            }
        } as React.HTMLAttributes<HTMLElement>)
    })

    const className = clsx(styles.list, classNameProp)
    const bindProps = {
        className,

        // Status
        'data-ready': ready,
        'data-hover': hover,

        // Events
        onKeyDown,
        onTouchStart,
        onTouchEnd,
        onTouchCancel: onTouchEnd,

        // Other
        tabIndex: 0,
        ...other
    } as React.HTMLAttributes<HTMLElement>

    return (
        <div data-role="menu-list" role="menu" ref={el} {...bindProps}>
            {items}
        </div>
    )
})
export default MenuList

function nextItem(list: Element, current?: Element): Element | undefined {
    if (list === current) {
        return list.firstChild as Element
    }
    if (current && current.nextElementSibling) {
        return current.nextElementSibling
    }
    return list.firstChild as Element
}

function prevItem(list: Element, current?: Element): Element | undefined {
    if (list === current) {
        return list.lastChild as Element
    }
    if (current && current.previousElementSibling) {
        return current.previousElementSibling
    }
    return list.lastChild as Element
}

function moveFocus(
    list: Element,
    current: Element | undefined,
    getNext: typeof nextItem | typeof prevItem
) {
    let next = getNext(list, current)

    while (next) {
        if (
            !next.hasAttribute('tabindex') ||
            (next as HTMLInputElement).disabled! === true ||
            next.getAttribute('aria-disabled') === 'true'
        ) {
            next = getNext(list, next)
        } else {
            ;(next as HTMLElement).focus()
            return
        }
    }
}
