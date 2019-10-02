import React from 'react'
import clsx from 'clsx'
import styles from './Grid.module.scss'

export type IGridGaps = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type IGridSizes =
    | false
    | 'auto'
    | true
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12

export interface IGirdProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean
    item?: boolean
    block?: boolean
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    sm?: IGridSizes
    md?: IGridSizes
    lg?: IGridSizes
    xl?: IGridSizes
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    justify?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
    alignContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'stretch'
}

const Grid: React.FC<IGirdProps> = props => {
    const {
        className: classNameProp,
        children,
        container,
        item,
        block,
        gap,
        sm,
        md,
        lg,
        xl,
        direction,
        wrap = 'wrap',
        justify,
        alignItems,
        alignContent,
        ...other
    }: typeof props = props

    const className = clsx(
        {
            [styles.container]: container,
            [styles.item]: item,
            [styles.block]: block,
            [styles[`gap`]]: gap !== undefined,
            [styles[`gap-${gap}`]]: gap !== undefined,
            [styles[`sm-${sm}`]]: sm,
            [styles[`md-${md}`]]: md,
            [styles[`lg-${lg}`]]: lg,
            [styles[`xl-${xl}`]]: xl,
            [styles[`direction--${direction}`]]: direction,
            [styles[`wrap--${wrap}`]]: wrap,
            [styles[`justify--${justify}`]]: justify,
            [styles[`align-items--${alignItems}`]]: alignItems,
            [styles[`align-content--${alignContent}`]]: alignContent
        },
        classNameProp
    )
    const bindProps = {
        className,
        ...other
    }
    return (
        <div data-role="grid" {...bindProps}>
            {children}
        </div>
    )
}

export default Grid