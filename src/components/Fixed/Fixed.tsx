import React from 'react'
import clsx from 'clsx'
import styles from './Fixed.module.scss'

export interface IFixedProps extends React.HTMLAttributes<HTMLElement> {
    top?: boolean
    bottom?: boolean
    faker?: boolean
}

const Fixed: React.FC<IFixedProps> = props => {
    const {
        className: classNameProp,
        top,
        bottom,
        faker,
        ...other
    }: typeof props = props

    const className = clsx(
        styles.origin,
        {
            [styles.top]: top,
            [styles.bottom]: bottom
        },
        classNameProp
    )
    const classNameFaker = clsx(styles.faker, classNameProp)

    const stopPropagationList: {
        [index in keyof React.DOMAttributes<Element>]: React.DOMAttributes<
            Element
        >[index]
    } = {
        onClickCapture: stopPropagation,
        onDoubleClickCapture: stopPropagation,
        onMouseUpCapture: stopPropagation,
        onMouseDownCapture: stopPropagation,
        onMouseMoveCapture: stopPropagation,
        onMouseEnter: stopPropagation,
        onMouseLeave: stopPropagation
    }

    const bindProps: React.HTMLAttributes<HTMLElement> = {
        className,
        ...other
    }

    const bindFakerProps: React.HTMLAttributes<HTMLElement> = {
        className: classNameFaker,
        ...stopPropagationList,
        ...other
    }

    return (
        <>
            {faker && <div data-role="fixed-faker" {...bindFakerProps} />}
            <div data-role="fixed-origin" {...bindProps} />
        </>
    )
}
export default Fixed

function stopPropagation(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation()
}
