import React from 'react'
import clsx from 'clsx'
import textMap from './map'
import styles from './Icon.module.scss'

document.body.appendChild(
    (() => {
        const el = document.createElement('script')
        el.src = 'https://kit.fontawesome.com/0d38ecc5a5.js'
        return el
    })()
)

export interface IIconProps extends React.HTMLAttributes<HTMLElement> {
    text?: keyof typeof textMap
}

const Icon: React.FC<IIconProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        text,
        ...other
    }: typeof props = props
    const className = clsx(styles.icon, classNameProp)
    const bindProps = {
        className,
        ...other
    }
    const children = text ? textMap[text] : ''

    return (
        <span data-role="icon" {...bindProps}>
            {children || childrenProp}
        </span>
    )
}

export default Icon
