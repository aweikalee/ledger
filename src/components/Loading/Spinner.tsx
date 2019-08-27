import React from 'react'
import clsx from 'clsx'
import styles from './Loading.module.scss'

export interface ILoadingSpinnerProps extends React.HTMLAttributes<HTMLElement> {
}

const LoadingSpinner: React.FC<ILoadingSpinnerProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props
    const className = clsx(
        styles.spinner,
        classNameProp
    )
    const bindProps = {
        className,
        ...other
    }

    return (
        <span data-role="loading-spinner" {...bindProps}>
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

export default LoadingSpinner
