import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'
import Grid from '@/components/Grid'
import { Button } from '@/components/Button'
import { PointSpinner } from '@/components/Loading'

import context from '../context'

import styles from './Index.module.scss'
import Icon from '@/components/Icon'

const UserIndex: React.FC<RouteComponentProps> = props => {
    const { user, loading } = React.useContext(context)

    return (
        <ContentBody maxWidth="sm">
            <Grid container direction="column" gap={4}>
                <Grid className={styles.header}>用户中心</Grid>
                <Grid alignItems="center">
                    {/* 头像 */}
                    <Grid
                        className={styles['profile-picture']}
                        justify="center"
                        alignItems="center"
                    >
                        {user && user.profile_picture ? (
                            <img src={user.profile_picture} alt="" />
                        ) : (
                            <Icon text="user" />
                        )}
                    </Grid>

                    {/* 用户名 */}
                    <Grid gap={4}>
                        {loading ? <PointSpinner /> : user && user.nickname}
                    </Grid>
                </Grid>
                <Grid direction="column" className={styles['button-list']}>
                    <Button
                        type="outlined"
                        color="default"
                        size="large"
                        border="round"
                        block
                        disabled
                    >
                        导出数据
                    </Button>
                    <Button
                        type="outlined"
                        color="default"
                        size="large"
                        border="round"
                        block
                        disabled
                    >
                        设置
                    </Button>

                    {user && user.admin === true && (
                        <Button
                            href="/user/currency"
                            type="outlined"
                            color="default"
                            size="large"
                            border="round"
                            block
                        >
                            货币种类
                        </Button>
                    )}
                </Grid>
                <Grid>
                    <Button
                        href="/login"
                        type="contained"
                        color="error"
                        size="large"
                        border="round"
                        block
                    >
                        注销
                    </Button>
                </Grid>
            </Grid>
        </ContentBody>
    )
}

export default UserIndex
