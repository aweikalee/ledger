import React from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'
import styles from './Loading.module.scss'

export interface ILoadingProps extends React.HTMLAttributes<HTMLElement> {}

const Loading: React.FC<ILoadingProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props
    const className = clsx(styles.loading, classNameProp)
    const bindProps = {
        className,
        ...other
    }
    const children = childrenProp || '拼命加载中'

    return (
        <div data-role="loading" {...bindProps}>
            <Spinner />
            <div data-role="loading-text">{children}</div>
        </div>
    )
}

export default Loading
