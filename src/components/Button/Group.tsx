import React, { useRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

export interface IButtonGroupProps extends React.HTMLAttributes<HTMLElement> {}

const Component = React.forwardRef<HTMLElement, IButtonGroupProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)
        const className = clsx(styles.group, classNameProp)
        const bindProps = {
            className,
            ...other
        }
        return (
            <div data-role="button-group" ref={el} {...bindProps}>
                {children}
            </div>
        )
    }
)

Component.displayName = 'ButtonGroup'
export default Component
