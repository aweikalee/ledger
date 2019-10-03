import React, { useRef } from 'react'
import { RouteChildrenProps } from 'react-router'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import styles from './Index.module.scss'

const LedgerIndex: React.FC<RouteChildrenProps> = props => {
    const refMask = useRef(null)

    const onMaskClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.target === refMask.current) {
            props.history.goBack()
        }
    }

    return (
        <>
            <NavigationBar
                title="详情"
                subTitle="2019-08-13"
                left={<BackButton href="/ledger/1" text="账簿" />}
            />
            <ContentBody>
                <Grid className={styles.record} container wrap="wrap">
                    <Grid sm={12}>
                        <Grid sm="auto">图标</Grid>
                        <Grid sm={true}>交通</Grid>
                        <Grid sm="auto">2019-08-18 16:59</Grid>
                    </Grid>
                    <Grid sm={12}>+18000.00 CNY</Grid>
                    <Grid sm={12}>成员 ________</Grid>
                    <Grid sm={12}>备注 ________</Grid>
                    <Grid sm={12} justify="space-around">
                        <Grid sm={true}>
                            <Button color="default">
                                <Icon text="close" />
                            </Button>
                        </Grid>
                        <Grid sm="auto">
                            <Button color="primary">
                                <Icon text="close" /> 编辑
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </ContentBody>
            <div ref={refMask} className={styles.mask} onClick={onMaskClick} />
            <ToolBar />
        </>
    )
}

export default LedgerIndex
