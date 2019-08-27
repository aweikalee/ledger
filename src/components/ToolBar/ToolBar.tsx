import React from 'react'
import clsx from 'clsx'
import Grid from '../Grid'
import ToolBarButton from './Button'
import Fixed, { IFixedProps } from '../Fixed/Fixed'
import styles from './ToolBar.module.scss'
export interface IToolBarProps extends React.HTMLAttributes<HTMLElement> {}

const ToolBar: React.FC<IToolBarProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        ...other
    }: typeof props = props

    const className = clsx(styles.toolbar, classNameProp)
    const bindProps: IFixedProps = {
        className,
        bottom: true,
        faker: true,
        ...other
    }

    return (
        <Fixed {...bindProps}>
            <Grid
                data-role="toolbar"
                container
                gap={4}
                justify="space-between"
                wrap="nowrap"
                className={styles['toolbar-grid']}
            >
                <Grid item>
                    <ToolBarButton icon="gear" title="设置" />
                </Grid>
                <Grid item>
                    <ToolBarButton
                        icon="plus"
                        title="添加"
                        type="contained"
                        primary
                        active
                    />
                </Grid>
                <Grid item>
                    <ToolBarButton icon="user" title="我的" />
                </Grid>
            </Grid>
        </Fixed>
    )
}

export default ToolBar
