import React from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

export interface IInputLabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    description?: React.ReactNode
}

const InputLabel = React.forwardRef<HTMLLabelElement, IInputLabelProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            description,
            ...other
        }: typeof props = props

        const className = clsx(styles.label, classNameProp)
        const bindProps = {
            ref,
            ...other
        }

        return (
            <div data-role="input-label-box" className={className}>
                <div data-role="input-label-wrapper">
                    <label data-role="input-label" {...bindProps}>
                        {children}
                    </label>
                </div>
                {description && (
                    <div data-role="input-label-description">{description}</div>
                )}
            </div>
        )
    }
)

export default InputLabel
