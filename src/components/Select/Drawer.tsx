import React, { useRef } from 'react'
import clsx from 'clsx'
import Drawer, { IDrawerProps } from '../Drawer/Drawer'
import Grid from '../Grid'
import styles from './Select.module.scss'
import Button from '../Button'

export interface ISelectDrawerProps extends IDrawerProps {
    // Event
    onUpdate?: () => void
    onConfirm?: () => void
    onClose?: () => void
    onClickCancel?: () => void

    // Other
    title?: string
}

const SelectDrawer = React.forwardRef<HTMLElement, ISelectDrawerProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,

            // Event
            onUpdate,
            onConfirm,
            onClickOverlay,
            onClose,
            onClickCancel,

            // Other
            title,
            anchor,
            ...other
        }: typeof props = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        const className = clsx(styles.modal, classNameProp)
        const bindProps: IDrawerProps = {
            className,
            anchor: 'bottom',
            onClickOverlay() {
                onClickOverlay && onClickOverlay()
                onClose && onClose()
            },
            ...other
        }

        return (
            <Drawer ref={el} {...bindProps}>
                {/* header */}
                <Grid
                    data-role="select-drawer-header"
                    container
                    alignItems="center"
                    gap={2}
                >
                    <Grid sm={3}>
                        {(onClickCancel || onClose) && (
                            <Button
                                type="text"
                                color="default"
                                size="small"
                                onClick={() => {
                                    onClickCancel && onClickCancel()
                                    onClose && onClose()
                                }}
                            >
                                取消
                            </Button>
                        )}
                    </Grid>
                    <Grid sm={6} justify="center">
                        {title && (
                            <div data-role="select-drawer-title">{title}</div>
                        )}
                    </Grid>
                    <Grid sm={3} justify="flex-end">
                        {onConfirm && (
                            <Button
                                type="text"
                                color="primary"
                                size="small"
                                onClick={() => onConfirm()}
                            >
                                确定
                            </Button>
                        )}
                    </Grid>
                </Grid>

                {/* select-columns */}
                <div data-role="select-drawer-panel">
                    <div data-role="select-drawer-columns">{children}</div>
                </div>
            </Drawer>
        )
    }
)

export default SelectDrawer
