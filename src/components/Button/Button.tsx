import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import clsx from 'clsx'
import styles, {
    IButtonTypes,
    IButtonSizes,
    IButtonColors,
    IButtonBorders
} from './Button.module.scss'

export interface IButtonProps extends React.HTMLAttributes<HTMLElement> {
    type?: IButtonTypes
    color?: IButtonColors
    size?: IButtonSizes
    border?: IButtonBorders
    href?: LinkProps['to']
    block?: boolean
    disabled?: boolean
}

const Button: React.FC<IButtonProps> = props => {
    const {
        className: classNameProp,
        children,
        type = 'text',
        color,
        size,
        border,
        disabled,
        block,
        href,
        ...other
    }: typeof props = props

    const className = clsx(
        styles.button,
        {
            [styles[type]]: true,
            [styles[color!]]: !disabled && color,
            [styles[size!]]: size,
            [styles.block]: block,
            [styles[border || 'round']]: border
        },
        classNameProp
    )

    const bindProps: React.HTMLAttributes<HTMLElement> & {
        [key: string]: any
    } = {
        className,
        disabled,
        ...other
    }

    return href ? (
        <Link data-role="button" to={href} {...bindProps}>
            {children}
        </Link>
    ) : (
        <button data-role="button" {...bindProps}>
            {children}
        </button>
    )
}

export default Button
