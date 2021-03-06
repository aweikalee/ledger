import React, { useRef } from 'react'
import clsx from 'clsx'
import styles from './Checkbox.module.scss'

export interface ICheckboxProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: number | string

    // Status
    checked?: boolean
    disabled?: boolean
}
const Component = React.forwardRef<HTMLElement, ICheckboxProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value,

            // Status
            checked,
            disabled,

            // Display
            tabIndex = 0,

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const className = clsx(styles.checkbox, classNameProp)
        const bindProps = {
            className,
            'aria-disabled': disabled ? true : undefined,
            ...other
        }

        return (
            <div
                data-role="checkbox"
                role="checkbox"
                aria-checked={!disabled && checked ? true : undefined}
                ref={el}
                data-value={value}
                {...bindProps}
            >
                <div
                    data-role="checkbox-checkbox"
                    tabIndex={disabled ? undefined : tabIndex}
                ></div>
                {children && (
                    <div data-role="checkbox-label">
                        <div data-role="checkbox-label-text">{children}</div>
                    </div>
                )}
            </div>
        )
    }
)

Component.displayName = 'Checkbox'
export default Component
