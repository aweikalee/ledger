import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { ICheckboxProps } from './Checkbox'
import styles from './Checkbox.module.scss'

export interface ICheckboxGroupProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: (string | number)[]

    // Event
    onUpdate?: (value: (string | number)[]) => void
}

const Component = React.forwardRef<HTMLElement, ICheckboxGroupProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            style,

            // Value
            value: valueProp = [],

            // Event
            onUpdate: onUpdateProp,

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const onClickItem: (
            child: React.ReactElement
        ) => React.HTMLAttributes<HTMLElement>['onClick'] = child => e => {
            if (child.props.disabled) {
                return
            }

            if (child.props.onClick) {
                e.persist()
                child.props.onClick(e)
            }

            const value = child.props.value
            let newValue
            newValue = [...valueProp]
            const itemIndex = newValue.indexOf(value)
            if (itemIndex === -1) {
                newValue.push(value)
            } else {
                newValue.splice(itemIndex, 1)
            }

            if (onUpdateProp) {
                onUpdateProp(newValue)
            }
        }
        const items = React.Children.map(children, child => {
            if (
                !React.isValidElement<ICheckboxProps>(child) ||
                child.type === React.Fragment
            ) {
                return null
            }

            const selected =
                !child.props.disabled &&
                valueProp.indexOf(child.props.value as any) !== -1

            return React.cloneElement(child, {
                role: 'radio',
                value: undefined,
                'data-value': child.props.value,
                selected: selected,
                'aria-selected': selected,
                onClick: onClickItem(child)
            } as React.HTMLAttributes<HTMLElement>)
        })

        const className = clsx(styles.group, classNameProp)
        const bindProps = {
            className,
            style,

            // Other
            ...other
        } as React.HTMLAttributes<HTMLElement>

        return (
            <div data-role="group" ref={el} {...bindProps}>
                {items}
            </div>
        )
    }
)

Component.displayName = 'RadioGroup'
export default Component
