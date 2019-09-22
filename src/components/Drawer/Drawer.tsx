import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import clsx from 'clsx'
import Modal, { IModalProps } from '../Modal/Modal'
import styles from './Drawer.module.scss'

export interface IDrawerProps extends IModalProps {
    anchor?: 'top' | 'bottom' | 'left' | 'right'
}

const Drawer = React.forwardRef<HTMLElement, IDrawerProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        show,
        anchor = 'bottom',
        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

    const className = clsx(styles.drawer, classNameProp)
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
        <Modal show={show} ref={el} {...bindProps}>
            <CSSTransition
                in={show}
                appear
                timeout={350}
                classNames={classNames}
            >
                <div data-role="drawer" data-anchor={anchor}>
                    {children}
                </div>
            </CSSTransition>
        </Modal>
    )
})

export default Drawer
