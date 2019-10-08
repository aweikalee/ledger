import React from 'react'
import Notification, { INotification } from 'rc-notification'
import Icon from '../Icon'
import Button from '../Button'
import './index.scss'

export type IconType = 'info' | 'success' | 'error' | 'warn'

const cached: {
    [key: string]: INotification
} = {}

const getInstance = (callback: (n: INotification) => void) => {
    const cacheKey = 'rc-notification'
    if (cached[cacheKey]) {
        callback(cached[cacheKey])
        return
    }

    Notification.newInstance(
        {
            prefixCls: cacheKey,
            style: {},
            closeIcon: (
                <Button type="text" color="default" size="medium">
                    <Icon text="close" />
                </Button>
            )
        },
        n => {
            cached[cacheKey] = n
            callback(n)
        }
    )
}

const getIcon = (type: IconType) => <Icon text={type} />

export interface INotificationProps {
    content: React.ReactNode
    type?: IconType
    duration?: number
    key?: string
    onClose?: () => void
}

export const notification = {
    info(props: INotificationProps) {
        notification.open({
            ...props,
            type: 'info'
        })
    },
    success(props: INotificationProps) {
        notification.open({
            ...props,
            type: 'success'
        })
    },
    error(props: INotificationProps) {
        notification.open({
            ...props,
            type: 'error'
        })
    },
    warn(props: INotificationProps) {
        notification.open({
            ...props,
            type: 'warn'
        })
    },
    open(props: INotificationProps) {
        getInstance(n =>
            n.notice({
                content: (
                    <div className="rc-notification-wapper">
                        {props.type && (
                            <div
                                className="rc-notification-icon"
                                data-type={props.type}
                            >
                                {getIcon(props.type)}
                            </div>
                        )}
                        <div className="rc-notification-content">
                            {props.content}
                        </div>
                    </div>
                ),
                duration: props.duration === undefined ? 2 : props.duration,
                key: props.key,
                onClose: props.onClose,
                closable: true,
                style: {}
            })
        )
    },
    close(key: string) {
        getInstance(n => n.removeNotice(key))
    },
    destory() {
        getInstance(n => n.destroy())
    }
}

export default notification
