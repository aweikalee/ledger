import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export interface IButtonGroupProps extends React.HTMLAttributes<HTMLElement> {}

const ButtonGroup: React.FC<IButtonGroupProps> = props => {
    const {
        className: classNameProp,
        children,
        ...other
    }: typeof props = props
    const className = clsx(styles.group, classNameProp)
    const bindProps = {
        className,
        ...other
    }
    return (
        <div data-role="button-group" {...bindProps}>
            {children}
        </div>
    )
}

export default ButtonGroup