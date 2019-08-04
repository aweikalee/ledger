import React from 'react'
import clsx from 'clsx'
import styles from './ContentBody.module.scss'

export interface IContentBodydProps extends React.HTMLAttributes<HTMLElement> {
    maxWidth?: false | 'sm' | 'md' | 'lg'
}

const ContentBody: React.FC<IContentBodydProps> = props => {
    const {
        className: classNameProp,
        maxWidth = 'lg',
        ...other
    }: typeof props = props

    const className = clsx(
        styles['content-body'],
        {
            [styles[`max-${maxWidth}`]]: maxWidth
        },
        classNameProp
    )

    const bindProps: React.HTMLAttributes<HTMLElement> = {
        className,
        ...other
    }

    return <article data-role="content-body" {...bindProps} />
}
export default ContentBody
