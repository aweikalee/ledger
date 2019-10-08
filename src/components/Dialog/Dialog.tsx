import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import clsx from 'clsx'
import Modal, { IModalProps } from '../Modal/Modal'
import styles from './Dialog.module.scss'
import Icon from '../Icon'
import Button from '../Button'

export interface IDialogProps extends IModalProps {
    onClose?: Function
    onClickClose?: Function
    title?: string
    closeIcon?: boolean

    // footer
    footer?: React.ReactNode
    cancelText?: string
    confirmText?: string
    onCancel?: Function
    onConfirm?: Function
}

const Component = React.forwardRef<HTMLElement, IDialogProps>((props, ref) => {
    const onCloseProp = props.onClose || (() => {})
    const {
        className: classNameProp,
        children,
        show,
        onClose,
        onClickOverlay = onCloseProp,
        onClickClose = onCloseProp,
        title,
        closeIcon = true,

        // footer
        footer,
        cancelText = '取消',
        confirmText = '确定',
        onCancel = onCloseProp,
        onConfirm = () => {},

        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const className = clsx(styles.dialog, classNameProp)
    const bindProps: IModalProps = {
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
        <Modal
            show={show}
            onClickOverlay={onClickOverlay}
            ref={el}
            {...bindProps}
        >
            <CSSTransition
                in={show}
                appear
                timeout={350}
                classNames={classNames}
            >
                <div data-role="dialog">
                    <div data-role="dialog-header">
                        <div data-role="dialog-title">{title}</div>
                        {closeIcon && (
                            <div
                                data-role="dialog-close"
                                onClick={() => onClickClose()}
                            >
                                <Button type="text" color="default">
                                    <Icon text="plus"></Icon>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div data-role="dialog-content">{children}</div>
                    {footer === undefined ? (
                        <div data-role="dialog-footer">
                            <Button
                                type="outlined"
                                color="default"
                                size="medium"
                                border="round"
                                onClick={() => onCancel()}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                type="contained"
                                color="primary"
                                size="medium"
                                border="round"
                                onClick={() => onConfirm()}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    ) : (
                        footer
                    )}
                </div>
            </CSSTransition>
        </Modal>
    )
})

Component.displayName = 'Dialog'
export default Component
