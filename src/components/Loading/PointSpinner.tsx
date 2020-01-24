import React from 'react'
import clsx from 'clsx'
import styles from './Loading.module.scss'

export interface ILoadingPointSpinnerProps
    extends React.HTMLAttributes<HTMLElement> {}

const LoadingPointSpinner: React.FC<ILoadingPointSpinnerProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props
    const className = clsx(styles['point-spinner'], classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <span data-role="loading-spinner" {...bindProps}>
            <span data-role="loading-spinner_point"></span>
            <span data-role="loading-spinner_point"></span>
            <span data-role="loading-spinner_point"></span>
        </span>
    )
}

export default LoadingPointSpinner
