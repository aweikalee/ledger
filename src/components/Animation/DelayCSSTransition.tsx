import React, { useState } from 'react'
import CSSTransition, {
    CSSTransitionProps
} from 'react-transition-group/CSSTransition'

export interface IDelayCSSTransitionProps extends CSSTransitionProps {
    enterDelay?: number
    exitDelay?: number
}

const Icon: React.FC<IDelayCSSTransitionProps> = props => {
    const {
        children,
        style,
        enterDelay = 0,
        exitDelay = 0,
        timeout: timeoutProp,
        onEnter,
        onEntered,
        onExit,
        onExited,
        ...other
    }: typeof props = props
    const [delay, setIsDelay] = useState(0)

    const timeout: CSSTransitionProps['timeout'] = {
        appear: 0,
        enter: 0,
        exit: 0
    }

    if (typeof timeoutProp === 'number') {
        timeout.appear! += timeoutProp
        timeout.enter! += timeoutProp
        timeout.exit! += timeoutProp
    } else {
        timeout.appear! += timeoutProp.appear || 0
        timeout.enter! += timeoutProp.enter || 0
        timeout.exit! += timeoutProp.exit || 0
    }

    timeout.appear! += enterDelay
    timeout.enter! += enterDelay
    timeout.exit! += exitDelay

    return (
        <CSSTransition
            {...other}
            timeout={timeout}
            style={
                delay
                    ? {
                          transitionDelay: `${delay}ms`,
                          ...style
                      }
                    : style
            }
            onEnter={(node, isAppearing) => {
                enterDelay && setIsDelay(enterDelay)
                onEnter && onEnter(node, isAppearing)
            }}
            onEntered={(node, isAppearing) => {
                enterDelay && setIsDelay(0)
                onEntered && onEntered(node, isAppearing)
            }}
            onExit={node => {
                exitDelay && setIsDelay(exitDelay)
                onExit && onExit(node)
            }}
            onExited={node => {
                exitDelay && setIsDelay(0)
                onExited && onExited(node)
            }}
        >
            {children}
        </CSSTransition>
    )
}

export default Icon
