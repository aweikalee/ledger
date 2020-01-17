import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

import { useStore } from '@/store'

import styles from './Index.module.scss'

const UserLogin: React.FC<RouteComponentProps> = props => {
    const {
        user: { setToken }
    } = useStore()

    /* 登出 */
    React.useEffect(() => {
        setToken(null)
    }, [setToken])

    return (
        <ContentBody maxWidth="sm">
            <div className={styles.title}>毛呆手账</div>
            <Grid container gap={4} direction="column">
                <Grid>
                    <a href="/api/oauth/redirect/qq" className={styles.link}>
                        <Button
                            type="contained"
                            color="primary"
                            size="large"
                            border="round"
                            block
                        >
                            <Icon text="qq" /> QQ登录
                        </Button>
                    </a>
                </Grid>
                <Grid>
                    <a href="/api/oauth/redirect/weibo" className={styles.link}>
                        <Button
                            type="contained"
                            color="primary"
                            size="large"
                            border="round"
                            block
                        >
                            <Icon text="weibo" /> 微博登录
                        </Button>
                    </a>
                </Grid>
                <Grid>
                    <a
                        href="/api/oauth/redirect/github"
                        className={styles.link}
                    >
                        <Button
                            type="contained"
                            color="primary"
                            size="large"
                            border="round"
                            block
                        >
                            <Icon text="github" /> Github登录
                        </Button>
                    </a>
                </Grid>
            </Grid>
        </ContentBody>
    )
}

export default UserLogin
