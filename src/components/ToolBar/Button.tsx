import React from 'react'
import clsx from 'clsx'
import Icon from '../Icon'
import iconTextMap from '../Icon/map'
import Button, { IButtonProps } from '../Button/Button'
import styles from './Button.module.scss'

export interface IToolButtonProps extends IButtonProps {
    icon: keyof typeof iconTextMap
    active?: boolean
    primary?: boolean
}

const ToolButton: React.FC<IToolButtonProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        icon,
        primary,
        active,
        ...other
    }: typeof props = props
    const className = clsx(
        styles.button,
        primary ? styles.primary : styles.default,
        classNameProp
    )

    const bindProps: IButtonProps & {
        [key: string]: any
    } = {
        className,
        'data-active': active,
        ...other
    }

    return (
        <Button data-role="toolbar-button" {...bindProps}>
            <Icon data-role="icon" className={styles.icon} text={icon} />
        </Button>
    )
}

export default ToolButton
