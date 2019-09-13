import React, { useState } from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'

export interface IInputContext {
    focus: boolean
    error?: boolean
    disabled?: boolean
    onFocus: Function
    onBlur: Function
}
export const InputContext = React.createContext<IInputContext>({
    focus: false,
    onFocus: () => {},
    onBlur: () => {}
})

export interface IInputControlProps
    extends React.HTMLAttributes<HTMLDivElement> {
    error?: boolean
    disabled?: boolean
}
const InputControl: React.FC<IInputControlProps> = props => {
    const {
        className: classNameProp,
        children,
        error = false,
        disabled = false,
        ...other
    }: typeof props = props

    const [focus, setFocus] = useState(false)

    const childrenContext: IInputContext = {
        focus,
        error,
        disabled,
        onFocus() {
            setFocus(true)
        },
        onBlur() {
            setFocus(false)
        }
    }

    const className = clsx(styles.control, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <InputContext.Provider value={childrenContext}>
            <div
                data-role="input"
                data-focus={focus}
                data-error={error}
                data-disabled={disabled}
                {...bindProps}
            >
                {children}
            </div>
        </InputContext.Provider>
    )
}

export default InputControl
