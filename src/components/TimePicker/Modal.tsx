import React from 'react'
import clsx from 'clsx'
import { Modal } from '../Modal'
import { IModalProps } from '../Modal/Modal'
import styles from './TimePicker.module.scss'

const TimePickerPopup: React.FC<IModalProps> = props => {
    const { className: classNameProp, children, ...other }: typeof props = props

    const className = clsx(styles.modal, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    // const classNames: CSSTransitionClassNames = {
    //     appear: styles['appear'],
    //     appearActive: styles['appear-active'],
    //     enter: styles['enter'],
    //     enterActive: styles['enter-active'],
    //     exit: styles['exit'],
    //     exitActive: styles['exit-active']
    // }

    return <Modal {...bindProps}>{children}</Modal>
}

export default TimePickerPopup
