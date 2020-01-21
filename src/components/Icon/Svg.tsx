import React from 'react'
import clsx from 'clsx'
import textMap from './map'
import styles from './Svg.module.scss'

export interface ISvgProps extends React.SVGAttributes<SVGSVGElement> {
    text?: keyof typeof textMap
}

const Svg: React.FC<ISvgProps> = props => {
    const { className: classNameProp, text, ...other }: typeof props = props
    const className = clsx(styles.svg, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return <svg data-role="svg" {...bindProps}></svg>
}

export default Svg
