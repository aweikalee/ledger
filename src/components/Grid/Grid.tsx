import React, { useRef } from 'react'
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

const Component = React.forwardRef<HTMLDivElement, IGirdProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        container,
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

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const className = clsx(styles.grid, classNameProp)
    const bindProps = {
        className,
        ...other
    }
    const flexProp = {
        'data-container': container,
        'data-gap': gap,
        'data-sm': sm,
        'data-md': md,
        'data-lg': lg,
        'data-xl': xl,
        'data-direction': direction,
        'data-wrap': wrap,
        'data-justify': justify,
        'data-align-items': alignItems,
        'data-content': alignContent
    }
    return (
        <div data-role="grid" ref={el} {...flexProp} {...bindProps}>
            {children}
        </div>
    )
})

Component.displayName = 'Grid'
export default Component
