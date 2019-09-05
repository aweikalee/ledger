import React, { CSSProperties, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import styles from './Modal.module.scss'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { useStore } from '@/store'

export interface IModalProps extends React.HTMLAttributes<HTMLElement> {
    show?: boolean
    maskColor?: 'black' | 'white' | 'transparent'
    onClickMask?: React.DOMAttributes<HTMLDivElement>['onClick']
}

const MaskBase: React.FC<IModalProps> = props => {
    const {
        className: classNameProp,
        children,
        style: styleProp,
        show,
        maskColor = 'black',
        onClickMask = () => {},
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
    const className = clsx(styles.modal, classNameProp)
    const style: CSSProperties = {
        ...styleProp,
        zIndex: id + 10000
    }
    const bindProps = {
        className,
        style,
        ref: el,
        ...other
    }

    return (
        <div data-role="modal" {...bindProps}>
            {showMask && (
                <div
                    data-role="modal-mask"
                    className={styles.mask}
                    data-color={maskColor}
                    onClick={onClickMask}
                ></div>
            )}
            {children}
        </div>
    )
}

const Mask: React.FC<IModalProps> = props => {
    const [show, setShow] = useState(false)
    useEffect(() => {
        if (props.show) {
            requestAnimationFrame(() => {
                setShow(true)
            })
        } else {
            setShow(false)
        }
    }, [props.show])

    const classNames: CSSTransitionClassNames = {
        appear: styles['appear'],
        appearActive: styles['appear-active'],
        enter: styles['enter'],
        enterActive: styles['enter-active'],
        exit: styles['exit'],
        exitActive: styles['exit-active']
    }

    return (
        <CSSTransition
            in={show}
            appear
            timeout={400}
            classNames={classNames}
            unmountOnExit
        >
            <MaskBase {...props} />
        </CSSTransition>
    )
}

export default Mask
