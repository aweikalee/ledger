import React, { useRef, useContext, useLayoutEffect } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'
import Icon from '../Icon'
import { InputContext } from './Control'

const inputFC = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input {...props} ref={ref} />)

export interface IInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    before?: JSX.Element | string
    after?: JSX.Element | string
    clear?: boolean
    inputComponent?: React.ForwardRefExoticComponent<any>
    onUpdate?: (value: string) => void
}
const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        onUpdate,
        onChange: onChangeProp,
        onFocus: onFocusProp,
        onBlur: onBlurProp,
        before,
        after,
        clear,
        inputComponent,
        ...other
    }: typeof props = props

    const context = useContext(InputContext)

    const el = useRef<HTMLInputElement>(null)
    useLayoutEffect(() => {
        if (ref) {
            if ('current' in ref) {
                ;(ref as any).current = el.current
            } else {
                ref(el.current)
            }
        }
    }, [el, ref])

    const onChange: React.InputHTMLAttributes<
        HTMLInputElement
    >['onChange'] = e => {
        if (onChangeProp) {
            onChangeProp(e)
        }
        if (onUpdate) {
            onUpdate(e.target.value)
        }
    }

    const onClear: React.DOMAttributes<HTMLDivElement>['onClick'] = e => {
        const event = Object.create(e)
        const oldValue = el.current!.value
        event.target = el.current
        el.current!.value = ''
        onChange(event)
        el.current!.value = oldValue
    }

    const onFocus: React.InputHTMLAttributes<
        HTMLInputElement
    >['onFocus'] = e => {
        context.onFocus()
        if (onFocusProp) {
            onFocusProp(e)
        }
    }
    const onBlur: React.InputHTMLAttributes<HTMLInputElement>['onBlur'] = e => {
        context.onBlur()
        if (onBlurProp) {
            onBlurProp(e)
        }
    }

    const Component = inputComponent ? inputComponent : inputFC

    const className = clsx(styles.input, classNameProp)
    const bindProps = {
        disabled: context.disabled,
        onChange,
        onFocus,
        onBlur,
        ref: el,
        ...other
    }

    return (
        <div data-role="input-content" className={className}>
            {before && <div data-role="input-before">{before}</div>}
            <div data-role="input-box">
                <Component data-role="input-input" {...bindProps} />
            </div>
            {clear && !context.disabled && el.current && el.current.value && (
                <div data-role="input-clear" onClick={onClear}>
                    <Icon text="plus"></Icon>
                </div>
            )}
            {after && <div data-role="input-after">{after}</div>}
        </div>
    )
})

export default Input
