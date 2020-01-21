import React, { useEffect, useState, useRef, CSSProperties } from 'react'
import clsx from 'clsx'
import styles from './Modal.module.scss'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { useStore } from '@/store'
import {
    EnterHandler,
    ExitHandler,
    TransitionProps
} from 'react-transition-group/Transition'
import { Portal } from '../Portal'
import {
    getScrollBarWidth,
    hasScrollBar,
    hasScrollBarWidthDocumnet
} from '../utils/scrollBar'

export interface IModalProps extends React.HTMLAttributes<HTMLElement> {
    classNames?: CSSTransitionClassNames
    timeout?: TransitionProps['timeout']
    show?: boolean
    overlayColor?: 'black' | 'white' | 'transparent'
    onClickOverlay?: Function
    onEnter?: EnterHandler
    onExited?: ExitHandler
}

let saveOverflow: string | null = null
let savePaddingRight: string | null = null

const ModalBase = React.forwardRef<HTMLElement, IModalProps>((props, ref) => {
    const {
        className: classNameProp,
        children,
        style: styleProp,
        show,
        overlayColor = 'black',
        onClickOverlay,
        onEnter: onEnterProp,
        onExited: onExitedProp,
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
                    if (_queue.length === 0) {
                        document.body.style.overflow = saveOverflow as string
                        document.body.style.paddingRight = savePaddingRight!
                        saveOverflow = null
                        savePaddingRight = null
                    }
                    return _queue
                }
                return queue
            })
        }
    }, [show, setModalQueue, modalQueueRef])

    const showOverlay =
        modalQueue[modalQueue.length - 1] === id || modalQueue.length === 0

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)
    const [paddingRight, setPaddingRight] = useState(0)
    useEffect(() => {
        if (el.current && !showOverlay) {
            if (hasScrollBar(el.current)) {
                setPaddingRight(getScrollBarWidth())
            } else {
                setPaddingRight(0)
            }
        }
    }, [el, showOverlay])

    const className = clsx(classNameProp)
    const style: CSSProperties = {
        overflow: showOverlay ? '' : 'hidden',
        paddingRight: showOverlay ? undefined : paddingRight,
        ...styleProp
    }
    const isClickOverlay = useRef(false)
    const onMouseDown: React.DOMAttributes<
        HTMLDivElement
    >['onMouseDown'] = e => {
        if (e.target === el.current) {
            isClickOverlay.current = true
        }
        onMouseDownProp && onMouseDownProp(e)
    }
    const onMouseUp: React.DOMAttributes<HTMLDivElement>['onMouseUp'] = e => {
        if (e.target === el.current && isClickOverlay.current) {
            onClickOverlay && onClickOverlay()
        }
        isClickOverlay.current = false
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
            {showOverlay && (
                <div data-role="modal-overlay" data-color={overlayColor}></div>
            )}
            <div data-role="modal-body" {...bindProps}>
                {children}
            </div>
        </div>
    )
})

const Modal = React.forwardRef<HTMLElement, IModalProps>((props, ref) => {
    const {
        onEnter: onEnterProp,
        onExited: onExitedProp,
        classNames: classNamesProp,
        ...other
    }: typeof props = props

    const el = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => el.current!)

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

    const classNames: CSSTransitionClassNames = classNamesProp
        ? classNamesProp
        : {
              appear: styles['appear'],
              appearActive: styles['appear-active'],
              enter: styles['enter'],
              enterActive: styles['enter-active'],
              exit: styles['exit'],
              exitActive: styles['exit-active']
          }

    const onEnter: EnterHandler = (node, isAppearing) => {
        if (show && modalQueue.length === 0) {
            saveOverflow = document.body.style.overflow
            savePaddingRight = document.body.style.paddingRight
            document.body.style.overflow = 'hidden'
            if (hasScrollBarWidthDocumnet()) {
                document.body.style.paddingRight = `${getScrollBarWidth()}px`
            }
        }
        onEnterProp && onEnterProp(node, isAppearing)
    }
    const onExited: ExitHandler = node => {
        onExitedProp && onExitedProp(node)
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
                <ModalBase ref={el} {...other} />
            </CSSTransition>
        </Portal>
    )
})

export default Modal
