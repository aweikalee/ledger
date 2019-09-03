import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import * as amount from '@/utils/amount'
import styles from './Screen.module.scss'
import { SYMBOL_OPERATOR, FORMAT_OPTIONS } from './config'

export interface IKeyboradScreenProps
    extends React.HTMLAttributes<HTMLElement> {
    queue?: string[]
}

const Screen: React.FC<IKeyboradScreenProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        queue = ['0'],
        ...other
    }: typeof props = props

    const [screen, setScreen] = useState<JSX.Element[]>()
    useEffect(() => {
        setScreen(getScreenValue(queue))
    }, [queue])

    const el = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (el && el.current) {
            el.current.scrollTo({
                top: Number.MAX_SAFE_INTEGER
            })
        }
    }, [el, screen])

    const className = clsx(styles.screen, classNameProp)
    const bindProps = {
        className,
        ...other
    }

    return (
        <div data-role="calculator-screen" {...bindProps}>
            <div data-role="full" ref={el}>
                {screen}
            </div>
        </div>
    )
}

export default Screen

function getScreenValue(queue: string[]) {
    const len = queue.length
    return queue.map((part, index) => {
        const key = `${index},${part}`
        if (part in SYMBOL_OPERATOR) {
            return (
                <React.Fragment key={key}>
                    {index >= len - 2 ? <br /> : <wbr />}
                    <span data-role="operator" data-operator={part}>
                        {SYMBOL_OPERATOR[part as keyof typeof SYMBOL_OPERATOR]}
                    </span>
                </React.Fragment>
            )
        } else {
            return (
                <span data-role="number" key={key}>
                    {amount.format(part, FORMAT_OPTIONS)}
                </span>
            )
        }
    })
}
