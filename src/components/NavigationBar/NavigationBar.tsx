import React from 'react'
import clsx from 'clsx'
import Grid from '../Grid'
import Fixed from '../Fixed/Fixed'
import styles from './NavigationBar.module.scss'

export interface INavigationBarProps extends React.HTMLAttributes<HTMLElement> {
    title?: string
    subTitle?: string
    left?: JSX.Element
    right?: JSX.Element
}

const NavigationBar: React.FC<INavigationBarProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        title = '',
        subTitle = '',
        left: leftChildren,
        right: rightChildren,
        ...other
    }: typeof props = props

    const className = clsx(styles.navbar, classNameProp)
    const bindProps = {
        className,
        top: true,
        faker: true,
        ...other
    }

    const middleChildren = (
        <>
            <div data-role="title" className={styles.title}>
                {title}
            </div>
            {subTitle && (
                <div data-role="subtitle" className={styles.subtitle}>
                    {subTitle}
                </div>
            )}
        </>
    )
    return (
        <Fixed {...bindProps}>
            <Grid
                data-role="navigation-bar"
                container
                gap={1}
                className={styles['navbar-grid']}
            >
                <Grid sm={4} className={styles['close-box']}>
                    {leftChildren && leftChildren}
                </Grid>
                <Grid
                    sm={true}
                    direction="column"
                    className={styles['title-box']}
                >
                    {middleChildren}
                </Grid>
                <Grid sm={4} className={styles.tools}>
                    {rightChildren && rightChildren}
                </Grid>
            </Grid>
            {childrenProp}
        </Fixed>
    )
}

export default NavigationBar
