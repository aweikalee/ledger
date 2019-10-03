import React, { useRef } from 'react'
import clsx from 'clsx'
import { IRadioProps } from './Radio'
import styles from './Radio.module.scss'

export interface IRadioGroupProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: string | number

    // Event
    onUpdate?: (value: IRadioGroupProps['value']) => void
}

const Component = React.forwardRef<HTMLElement, IRadioGroupProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            style,

            // Value
            value: valueProp,

            // Event
            onUpdate: onUpdateProp,

            // Other
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const onClickItem: (
            child: React.ReactElement
        ) => React.HTMLAttributes<HTMLElement>['onClick'] = child => e => {
            if (child.props.disabled) {
                return
            }

            if (child.props.onClick) {
                e.persist()
                child.props.onClick(e)
            }

            const value = child.props.value

            if (onUpdateProp) {
                onUpdateProp(value)
            }
        }
        const items = React.Children.map(children, child => {
            if (
                !React.isValidElement<IRadioProps>(child) ||
                child.type === React.Fragment
            ) {
                return null
            }

            const checked =
                !child.props.disabled && valueProp === child.props.value

            return React.cloneElement(child, {
                role: 'radio',
                value: undefined,
                'data-value': child.props.value,
                checked: checked,
                'aria-checked': checked,
                onClick: onClickItem(child)
            } as React.HTMLAttributes<HTMLElement>)
        })

        const className = clsx(styles.group, classNameProp)
        const bindProps = {
            className,
            style,

            // Other
            ...other
        } as React.HTMLAttributes<HTMLElement>

        return (
            <div data-role="radiogroup" ref={el} {...bindProps}>
                {items}
            </div>
        )
    }
)

Component.displayName = 'RadioGroup'
export default Component
