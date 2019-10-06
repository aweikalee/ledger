import React, { useContext } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'
import { InputContext } from './Control'

export interface IInputHelperProps
    extends React.HTMLAttributes<HTMLDivElement> {
    error?: boolean
}

const InputHelper = React.forwardRef<HTMLDivElement, IInputHelperProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            error,
            ...other
        }: typeof props = props

        const context = useContext(InputContext)
        const className = clsx(styles.helper, classNameProp)
        const bindProps = {
            className,
            ref,
            ...other
        }

        return children ? (
            <div
                data-role="input-label-box"
                data-error={context.error || error ? true : undefined}
                {...bindProps}
            >
                {children}
            </div>
        ) : null
    }
)

export default InputHelper
