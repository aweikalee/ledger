import React from 'react'
import { LinkProps } from 'react-router-dom'
import clsx from 'clsx'
import Grid from '../Grid'
import ToolBarButton from './Button'
import Fixed, { IFixedProps } from '../Fixed/Fixed'
import styles from './ToolBar.module.scss'
export interface IToolBarProps extends React.HTMLAttributes<HTMLElement> {
    href?: {
        main?: LinkProps['to']
        option?: LinkProps['to']
        user?: LinkProps['to']
    }
    active?: {
        main?: boolean
        option?: boolean
        user?: boolean
    }
}

const ToolBar: React.FC<IToolBarProps> = props => {
    const {
        className: classNameProp,
        children: childrenProp,
        active = {},
        href = {},
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
                <Grid>
                    <ToolBarButton
                        icon="gear"
                        title="设置"
                        active={!!active.option}
                        href={
                            href.option === undefined ? '/option' : href.option
                        }
                    />
                </Grid>
                <Grid>
                    <ToolBarButton
                        icon="plus"
                        title="添加"
                        type="contained"
                        primary
                        active={!!active.main}
                        href={href.main === undefined ? '/' : href.main}
                    />
                </Grid>
                <Grid>
                    <ToolBarButton
                        icon="user"
                        title="我的"
                        active={!!active.user}
                        href={href.user === undefined ? '/user' : href.user}
                    />
                </Grid>
            </Grid>
        </Fixed>
    )
}

export default ToolBar
