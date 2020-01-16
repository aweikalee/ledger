import React from 'react'
import clsx from 'clsx'
import Button, { IButtonProps } from '../Button/Button'
import Icon from '../Icon'
import styles from './BackButton.module.scss'
import styleVars from '@/style/index.module.scss'
import measure from '../utils/measure'

export interface IBackButtonProps extends IButtonProps {
    icon?: 'back' | 'close'
    text?: string
}

const NavigationBar: React.FC<IBackButtonProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        icon = 'back',
        text = '',
        onClick,
        ...other
    }: typeof props = props

    const className = clsx(styles.back, classNameProp)
    const bindProps: IButtonProps = {
        className,
        onClick,
        ...other
    }

    return (
        <Button size="medium" color="default" {...bindProps}>
            <Icon
                text={icon === 'back' ? 'angle-left' : 'close'}
                className={styles['back-icon']}
            />
            <span
                data-role="text"
                className={styles['back-text']}
                style={{
                    transform: `scale(${getTextScale(text)})`
                }}
            >
                {text}
            </span>
        </Button>
    )
}

export default NavigationBar

let baseTextWidth: number
function getTextScale(text: string) {
    if (!baseTextWidth) {
        baseTextWidth = measure('四个中文', {
            fontFamily: styleVars.fontFamily
        }).width
    }
    const width = measure(text, {
        fontFamily: styleVars.fontFamily
    }).width

    return width < baseTextWidth ? 1 : baseTextWidth / width
}
