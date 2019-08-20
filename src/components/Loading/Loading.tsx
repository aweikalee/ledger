import React from 'react'
import clsx from 'clsx'
import styles from './Loading.module.scss'

export interface ILoadingProps extends React.HTMLAttributes<HTMLElement> {
    block?: boolean
}

const Loading: React.FC<ILoadingProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        block,
        ...other
    }: typeof props = props
    const className = clsx(
        styles.loading,
        {
            [styles.block]: block
        },
        classNameProp
    )
    const bindProps = {
        className,
        ...other
    }

    return (
        <span data-role="loading" {...bindProps}>
            <svg data-role="loading-svg" viewBox="25 25 50 50">
                <circle
                    data-role="loading-circle"
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                />
            </svg>
        </span>
    )
}

export default Loading
