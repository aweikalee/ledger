import React from 'react'
import clsx from 'clsx'
import Loading from './Loading'
import styles from './Loading.module.scss'

export interface ILoadingBlockProps extends React.HTMLAttributes<HTMLElement> {}

const LoadingBlock: React.FC<ILoadingBlockProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props
    const className = clsx(styles['loading-block'], classNameProp)
    const bindProps = {
        className,
        ...other
    }
    const children = childrenProp || '拼命加载中'

    return (
        <div data-role="loading-block" {...bindProps}>
            <Loading block />
            <div data-role="loading-text">{children}</div>
        </div>
    )
}

export default LoadingBlock
