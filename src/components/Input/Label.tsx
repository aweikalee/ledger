import React from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

export interface IInputLabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel = React.forwardRef<HTMLLabelElement, IInputLabelProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            ...other
        }: typeof props = props

        const className = clsx(styles.label, classNameProp)
        const bindProps = {
            ref,
            ...other
        }

        return (
            <div data-role="input-label-box" className={className}>
                <label data-role="input-label" {...bindProps}>
                    {children}
                </label>
            </div>
        )
    }
)

export default InputLabel
