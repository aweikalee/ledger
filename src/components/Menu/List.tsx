import React, { useState, useEffect, useRef, useMemo } from 'react'
import clsx from 'clsx'
import ReactList, { ReactListProps } from 'react-list'
import { getScrollBarWidth } from '../utils/scrollBar'
import styles from './Menu.module.scss'

const SCROLLBAR_WIDTH = getScrollBarWidth()

const Filler: React.FC<{
    itemHeight?: number
}> = props => {
    const { itemHeight }: typeof props = props

    return (
        <div
            style={{
                height: itemHeight ? `calc(100% - ${itemHeight}px)` : '100%'
            }}
        ></div>
    )
}

export interface IMenuListProps extends React.HTMLAttributes<HTMLElement> {
    // Display
    filler?: boolean

    // Options
    length?: ReactListProps['length']
    itemRenderer?: ReactListProps['itemRenderer']
    itemsRenderer?: ReactListProps['itemsRenderer']
    listRef?: React.Ref<ReactList>
}

const MenuList = React.forwardRef<HTMLElement, IMenuListProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        style,

        // Display
        tabIndex = 0,
        filler,

        // Options
        length,
        itemRenderer,
        itemsRenderer,
        listRef,

        // Other
        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const elList = useRef<ReactList>(null)
    React.useImperativeHandle(listRef, () => elList.current!)

    /* 键盘操作 */
    const onKeyDown: IMenuListProps['onKeyDown'] = e => {
        if (!el.current) {
            return
        }

        const key = e.key
        const activeElement = (el.current.ownerDocument || document)
            .activeElement!
        const _elList = elList.current!

        if (key === 'ArrowDown') {
            e.preventDefault()
            moveFocus(_elList.items, activeElement, nextItem)
        } else if (key === 'ArrowUp') {
            moveFocus(_elList.items, activeElement, prevItem)
            e.preventDefault()
        } else if (key === 'Home') {
            e.preventDefault()
            _elList.items.focus()
            el.current.scrollTop = 0
        } else if (key === 'End') {
            e.preventDefault()
            _elList.items.focus()
            el.current.scrollTop = el.current.scrollHeight
        } else if (key === 'PageUp') {
            _elList.items.focus()
            _elList.scrollAround(_elList.getVisibleRange()[0] - 10)
        } else if (key === 'PageDown') {
            _elList.items.focus()
            _elList.scrollAround(_elList.getVisibleRange()[1] + 10)
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
    const onTouchStart: IMenuListProps['onTouchStart'] = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        setHover(true)
    }
    const onTouchEnd: IMenuListProps['onTouchEnd'] = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current)
        }
        hoverTimer.current = setTimeout(() => {
            setHover(false)
        }, 3000)
    }

    const items = useMemo(() => React.Children.toArray(children), [children])

    const className = clsx(styles.list, classNameProp)
    const bindProps = {
        className,
        style,

        // Status
        'data-hover': hover,

        // Events
        onKeyDown,
        onTouchStart,
        onTouchEnd,
        onTouchCancel: onTouchEnd,

        // Other
        ...other
    } as React.HTMLAttributes<HTMLElement>

    return (
        <div data-role="menu-list" ref={el} {...bindProps}>
            <ReactList
                length={length || items.length}
                type="uniform"
                ref={elList}
                threshold={30}
                scrollParentGetter={component => {
                    return component.getEl().parentElement!
                }}
                itemsRenderer={
                    itemsRenderer
                        ? itemsRenderer
                        : (items, ref) => {
                              return (
                                  <div
                                      role="menu"
                                      ref={ref}
                                      tabIndex={tabIndex}
                                  >
                                      {items}
                                  </div>
                              )
                          }
                }
                itemRenderer={(index, key) => {
                    const item = itemRenderer
                        ? itemRenderer(index, key)
                        : items[index]

                    const _props = {
                        key: itemRenderer ? undefined : key,
                        style: {
                            paddingRight: SCROLLBAR_WIDTH
                        }
                    }

                    if (
                        React.isValidElement(item) &&
                        item.type !== React.Fragment
                    ) {
                        return React.cloneElement(item, _props)
                    }
                }}
            />
            {filler && (
                <Filler
                    itemHeight={
                        elList.current
                            ? elList.current.getSizeOfItem(
                                  (length || items.length) - 1
                              )
                            : undefined
                    }
                />
            )}
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
    return list.lastChild as Element
}

function prevItem(list: Element, current?: Element): Element | undefined {
    if (list === current) {
        return list.lastChild as Element
    }
    if (current && current.previousElementSibling) {
        return current.previousElementSibling
    }
    return list.firstChild as Element
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
