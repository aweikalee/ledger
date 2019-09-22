import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import clsx from 'clsx'
import Modal, { IModalProps } from '../Modal/Modal'
import styles from './Popup.module.scss'
import Icon from '../Icon'
import Button from '../Button'

export interface IPopupProps extends IModalProps {
    onClose?: Function
    onClickClose?: Function
    header?: boolean
    title?: string
    contentPadding?: boolean
}

const Popup: React.FC<IPopupProps> = React.forwardRef<HTMLElement, IPopupProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            show,
            onClickOverlay = () => {},
            onClickClose = () => {},
            onClose = () => {},
            header,
            title = '',
            contentPadding = false,
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const className = clsx(styles.popup, classNameProp)
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
                onClickOverlay={() => {
                    onClickOverlay()
                    onClose()
                }}
                ref={el}
                {...bindProps}
            >
                <CSSTransition
                    in={show}
                    appear
                    timeout={350}
                    classNames={classNames}
                >
                    <div data-role="popup">
                        {header && (
                            <div data-role="popup-header">
                                <div data-role="popup-title">{title}</div>
                                <div
                                    data-role="popup-close"
                                    onClick={() => {
                                        onClickClose()
                                        onClose()
                                    }}
                                >
                                    <Button type="text" color="default">
                                        <Icon text="plus"></Icon>
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div
                            data-role="popup-content"
                            data-padding={contentPadding}
                        >
                            {children}
                        </div>
                    </div>
                </CSSTransition>
            </Modal>
        )
    }
)

export default Popup
