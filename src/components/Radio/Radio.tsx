import React, { useRef } from 'react'
import clsx from 'clsx'
import styles from './Radio.module.scss'

export interface IRadioProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: number | string

    // Status
    checked?: boolean
    disabled?: boolean
}
const Component = React.forwardRef<HTMLElement, IRadioProps>((props, ref) => {
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

    const className = clsx(styles.radio, classNameProp)
    const bindProps = {
        className,
        'aria-disabled': disabled ? true : undefined,
        ...other
    }

    return (
        <div
            data-role="radio"
            role="radio"
            aria-checked={!disabled && checked ? true : undefined}
            ref={el}
            data-value={value}
            {...bindProps}
        >
            <div
                data-role="radio-radio"
                tabIndex={disabled ? undefined : tabIndex}
            ></div>
            {children && (
                <div data-role="radio-label">
                    <div data-role="radio-label-text">{children}</div>
                </div>
            )}
        </div>
    )
})

Component.displayName = 'Radio'
export default Component
