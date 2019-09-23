import React, { useRef } from 'react'
import clsx from 'clsx'
import styles from './Menu.module.scss'

export interface IMenuItemProps extends React.HTMLAttributes<HTMLElement> {
    selected?: boolean
    disabled?: boolean
    align?: 'left' | 'center' | 'right'
}
const MenuItem = React.forwardRef<HTMLElement, IMenuItemProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        selected,
        disabled,
        align = 'left',
        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const className = clsx(styles.item, classNameProp)
    const bindProps = {
        className,
        'aria-selected': !disabled && selected ? true : undefined,
        'aria-disabled': disabled ? true : undefined,
        ...other
    }

    return (
        <div
            data-role="menu-item"
            role="menuitem"
            ref={el}
            tabIndex={-1}
            {...bindProps}
        >
            <div data-role="menu-item-content" data-align={align}>
                {children}
            </div>
        </div>
    )
})

export default MenuItem
