import React, { useRef } from 'react'
import clsx from 'clsx'
import styles from './Select.module.scss'
import Item, { IMenuItemProps } from '../Menu/Item'

export interface ISelectOptionProps extends IMenuItemProps {
    // Value
    value?: string | number
}

const SelectOption = React.forwardRef<HTMLElement, ISelectOptionProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value = '',

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const className = clsx(styles.option, classNameProp)
        const bindProps: React.HTMLAttributes<HTMLElement> = {
            className,

            // Other
            ...other
        }

        return (
            <Item
                ref={el}
                data-role="select-option"
                role="option"
                data-value={value}
                {...bindProps}
            >
                {children}
            </Item>
        )
    }
)
export default SelectOption
