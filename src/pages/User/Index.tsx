import React from 'react'
import { RouteComponentProps } from 'react-router'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'
import { Grid } from '@/components/Grid'

import { useStore } from '@/store'

import styles from './Index.module.scss'

const UserLogin: React.FC<RouteComponentProps> = props => {
    const { history } = props

    const store = useStore()

    return (
        <>
            <NavigationBar
                title="用户中心"
                left={<BackButton onClick={() => history.goBack()} />}
            />
            <ContentBody maxWidth="sm">
                <Grid container gap={4}>
                    <Grid sm={12} className={styles.card}>
                        {store.nickanme}
                    </Grid>
                    <Grid sm={12}>
                        <Grid sm={12} className={styles.buttons}>
                            <Button
                                type="text"
                                color="default"
                                block
                                size="large"
                                disabled
                            >
                                修改密码
                            </Button>
                            <Button
                                type="text"
                                color="default"
                                block
                                size="large"
                                disabled
                            >
                                修改资料
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid sm={12}>
                        <Button
                            type="contained"
                            color="error"
                            block
                            size="large"
                            border="round"
                            href="/logout"
                            tabIndex={1}
                        >
                            退出帐号
                        </Button>
                    </Grid>
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default UserLogin
