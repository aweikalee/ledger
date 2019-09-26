import React, { useRef } from 'react'
import clsx from 'clsx'
import { Modal } from '../Modal'
import { IModalProps } from '../Modal/Modal'
import styles from './DatePicker.module.scss'
import CSSTransition, {
    CSSTransitionClassNames
} from 'react-transition-group/CSSTransition'

const Component = React.forwardRef<HTMLElement, IModalProps>((props, ref) => {
    const { className: classNameProp, children, ...other }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const className = clsx(styles.modal, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    const classNames: CSSTransitionClassNames = {
        appear: styles['appear'],
        appearActive: styles['appear-active'],
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }

    return (
        <Modal ref={el} {...bindProps}>
            <CSSTransition
                in={props.show}
                appear
                timeout={350}
                classNames={classNames}
            >
                {children}
            </CSSTransition>
        </Modal>
    )
})

Component.displayName = 'DatePickerPopup'
export default Component
