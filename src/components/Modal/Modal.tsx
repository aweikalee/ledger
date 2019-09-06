import React, { useEffect, useState, useRef, CSSProperties } from 'react'
import clsx from 'clsx'
import styles from './Modal.module.scss'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { useStore } from '@/store'
import { EnterHandler, ExitHandler } from 'react-transition-group/Transition'
import { Portal } from '../Portal'

export interface IModalProps extends React.HTMLAttributes<HTMLElement> {
    show?: boolean
    maskColor?: 'black' | 'white' | 'transparent'
    onClickMask?: Function
}

const MaskBase: React.FC<IModalProps> = props => {
    const {
        className: classNameProp,
        children,
        show,
        maskColor = 'black',
        onClickMask = () => {},
        onMouseDown: onMouseDownProp,
        onMouseUp: onMouseUpProp,
        ...other
    }: typeof props = props

    const [id, setID] = useState(0)
    const { modalQueue, setModalQueue, modalQueueRef } = useStore()
    useEffect(() => {
        if (!show) {
            return
        }

        const max = modalQueueRef.current[modalQueueRef.current.length - 1]
        const value = (max || 0) + 1
        setModalQueue(queue => [...queue, value])
        setID(value)

        return () => {
            setModalQueue(queue => {
                const find = queue.indexOf(value)
                if (find > -1) {
                    const _queue = [...queue]
                    _queue.splice(find, 1)
                    return _queue
                }
                return queue
            })
        }
    }, [show, setModalQueue, modalQueueRef])

    const showMask =
        modalQueue[modalQueue.length - 1] === id || modalQueue.length === 0

    const el = useRef<HTMLDivElement>(null)
    const className = clsx(classNameProp)
    const style: CSSProperties = {
        overflow: showMask ? '' : 'hidden'
    }
    const isClickMask = useRef(false)
    const onMouseDown: React.DOMAttributes<
        HTMLDivElement
    >['onMouseDown'] = e => {
        if (e.target === el.current) {
            isClickMask.current = true
        }
        onMouseDownProp && onMouseDownProp(e)
    }
    const onMouseUp: React.DOMAttributes<HTMLDivElement>['onMouseUp'] = (e) => {
        if (e.target === el.current && isClickMask.current) {
            onClickMask()
        }
        isClickMask.current = false
        onMouseUpProp && onMouseUpProp(e)
    }
    const bindProps = {
        className,
        ref: el,
        style,
        onMouseDown,
        onMouseUp,
        ...other
    }

    return (
        <div
            data-role="modal"
            className={styles.modal}
            style={{ zIndex: id + 10000 }}
        >
            {showMask && (
                <div data-role="modal-mask" data-color={maskColor}></div>
            )}
            <div data-role="modal-body" {...bindProps}>
                {children}
            </div>
        </div>
    )
}

let saveOverflow: string | null = null
const Mask: React.FC<IModalProps> = props => {
    const { modalQueue } = useStore()

    const [show, setShow] = useState(false)
    useEffect(() => {
        if (props.show) {
            const timmer = requestAnimationFrame(() => {
                setShow(true)
            })

            return () => {
                cancelAnimationFrame(timmer)
            }
        } else {
            setShow(false)
        }

        return () => {}
    }, [props.show])

    const classNames: CSSTransitionClassNames = {
        appear: styles['appear'],
        appearActive: styles['appear-active'],
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }

    const onEnter: EnterHandler = () => {
        if (show && modalQueue.length === 0) {
            saveOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
        }
    }
    const onExited: ExitHandler = () => {
        if (!show && modalQueue.length === 0) {
            document.body.style.overflow = saveOverflow
            saveOverflow = null
        }
    }

    return (
        <Portal container="modal">
            <CSSTransition
                in={show}
                appear
                timeout={150}
                classNames={classNames}
                unmountOnExit
                onEnter={onEnter}
                onExited={onExited}
            >
                <MaskBase {...props} />
            </CSSTransition>
        </Portal>
    )
}

export default Mask
