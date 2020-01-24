import React from 'react'
import clsx from 'clsx'
import styles from './Loading.module.scss'

export interface ILoadingBlockSpinnerProps
    extends React.HTMLAttributes<HTMLElement> {}

const LoadingBlockSpinner: React.FC<ILoadingBlockSpinnerProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props
    const className = clsx(styles['block-spinner'], classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <span data-role="loading-spinner" {...bindProps}>
            <div data-role="loading-spinner_content">
                <div data-role="loading-spinner_block"></div>
                <div data-role="loading-spinner_block"></div>
                <div data-role="loading-spinner_block"></div>
                <div data-role="loading-spinner_block"></div>
            </div>
        </span>
    )
}

export default LoadingBlockSpinner
