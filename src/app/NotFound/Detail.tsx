import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Grid from '@/components/Grid'
import Button from '@/components/Button'

import styles from './Index.module.scss'

const NotFoundDetail: React.FC<RouteComponentProps> = props => {
    const { history } = props
    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            gap={2}
        >
            <Grid className={styles.icon}>404</Grid>
            <Grid className={styles.text}>这里什么也没有</Grid>
            <Grid alignItems="center">
                <Button
                    type="text"
                    color="primary"
                    size="medium"
                    onClick={() => history.goBack()}
                >
                    后退
                </Button>
                或
                <Button type="text" color="primary" size="medium" href="/">
                    返回主页
                </Button>
            </Grid>
        </Grid>
    )
}

export default NotFoundDetail
