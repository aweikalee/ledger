import React from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

export interface IInputHelperProps
    extends React.HTMLAttributes<HTMLDivElement> {}

const InputHelper = React.forwardRef<HTMLDivElement, IInputHelperProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            ...other
        }: typeof props = props

        const className = clsx(styles.helper, classNameProp)
        const bindProps = {
            className,
            ref,
            ...other
        }

        return (
            <div data-role="input-label-box" {...bindProps}>
                {children}
            </div>
        )
    }
)

export default InputHelper
