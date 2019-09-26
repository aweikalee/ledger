import React, { useRef, useEffect, CSSProperties, useState } from 'react'
import clsx from 'clsx'
import styles from './Select.module.scss'
import MenuList from '../Menu/List'
import { ISelectOptionProps } from './Option'

const Filler: React.FC<{
    observer: any
}> = props => {
    // FIXME: resize
    const el = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<CSSProperties>({})
    useEffect(() => {
        if (!el.current) {
            return
        }

        const prev = el.current.previousElementSibling as HTMLElement
        let height
        if (prev) {
            height = `calc(100% - ${prev.offsetHeight}px)`
        } else {
            height = '100%'
        }

        setStyle({
            height
        })
    }, [el, props.observer])

    return <div ref={el} style={style}></div>
}

export interface ISelectColumnProps extends React.HTMLAttributes<HTMLElement> {
    // Value
    value?: string | number | (string | number)[]

    // Options
    multiple?: boolean

    // Display
    filler?: boolean

    // Events
    onUpdate?: (value: ISelectColumnProps['value']) => void
}

const Column = React.forwardRef<HTMLElement, ISelectColumnProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Value
            value: valueProp = '',

            // Options
            multiple,

            // Display
            filler,

            // Events
            onTouchStart: onTouchStartProp,
            onTouchEnd: onTouchEndProp,
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
            let newValue
            if (multiple) {
                newValue = Array.isArray(valueProp) ? [...valueProp] : []
                const itemIndex = newValue.indexOf(value)
                if (itemIndex === -1) {
                    newValue.push(value)
                } else {
                    newValue.splice(itemIndex, 1)
                }
            } else {
                newValue = value
            }

            if (onUpdateProp) {
                onUpdateProp(newValue)
            }
        }
        const items = React.Children.map(children, child => {
            if (
                !React.isValidElement<ISelectOptionProps>(child) ||
                child.type === React.Fragment
            ) {
                return null
            }

            const selected = checkSelected(
                !!multiple,
                valueProp,
                child.props.value
            )

            return React.cloneElement(child, {
                role: multiple ? 'checkbox' : 'option',
                value: undefined,
                'data-value': child.props.value,
                'aria-selected': selected ? true : undefined,
                'aria-checked': selected ? true : undefined,
                selected,
                onClick: onClickItem(child)
            } as React.HTMLAttributes<HTMLElement>)
        })

        const className = clsx(styles.column, classNameProp)
        const bindProps: React.HTMLAttributes<HTMLElement> = {
            className,

            // Other
            tabIndex: 0,
            ...other
        }

        return (
            <MenuList
                ref={el}
                data-role="select-column"
                role="listbox"
                {...bindProps}
            >
                {items}
                {filler && <Filler observer={children} />}
            </MenuList>
        )
    }
)
export default Column

function checkSelected(
    multiple: boolean,
    a: ISelectColumnProps['value'],
    b: string | number | undefined
) {
    if (multiple) {
        if (Array.isArray(a)) {
            return a.indexOf(b!) !== -1
        }
    }
    return a === b
}
