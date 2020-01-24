import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Loading from '@/components/Loading'

import { useStore } from '@/store'
import { IClassify } from '@/model/types/classify'
import * as display from '@/middleware/record/display'

import Hook from '../../Index/Ledger/Hook'
import Add from './Add/Index'
import Edit from './Edit/Index'
import Remove from './Remove/Index'

import styles from './Index.module.scss'

export interface IClassifyIndexProps {}
export interface IClassifyIndexRouteProps {
    id: string
}

const ClassifyIndex: React.FC<RouteComponentProps<IClassifyIndexRouteProps> &
    IClassifyIndexProps> = props => {
    const {
        history,
        match: { path, url }
    } = props
    const { ledger } = useStore()

    /* edit, remove */
    const [edit, setEdit] = React.useState<IClassify | null>(null)
    const [remove, setRemove] = React.useState<IClassify | null>(null)

    React.useEffect(() => {
        if (edit) {
            history.replace(`${url}/edit`)
        } else if (remove) {
            history.replace(`${url}/remove`)
        } else {
            history.replace(url)
        }
    }, [edit, remove, history, url])

    /* list */
    const list = ((ledger.data && ledger.data.classifies) || []).map(
        classify => (
            <Grid
                className={styles.item}
                key={classify._id || classify.text}
                alignItems="center"
                alignContent="space-between"
                gap={2}
            >
                <Grid>
                    <display.Icon classify={classify} />
                </Grid>
                <Grid sm>
                    <div className={styles.name}>{classify.text}</div>
                </Grid>
                <Grid>
                    <Button
                        type="text"
                        color="default"
                        size="large"
                        onClick={() => setRemove(classify)}
                    >
                        <Icon text="trash" />
                    </Button>
                    <Button
                        type="text"
                        color="primary"
                        size="large"
                        onClick={() => setEdit(classify)}
                    >
                        <Icon text="pen" />
                    </Button>
                </Grid>
            </Grid>
        )
    )

    return (
        <>
            <NavigationBar
                title="分类管理"
                subTitle={ledger.data && ledger.data.title}
                left={
                    <BackButton
                        icon="back"
                        onClick={() => {
                            history.goBack()
                        }}
                    >
                        返回
                    </BackButton>
                }
                right={
                    <Button
                        href={`${url}/add`}
                        type="text"
                        color="primary"
                        size="medium"
                    >
                        新增
                    </Button>
                }
            />

            <ContentBody maxWidth="sm">
                <Grid container gap={2} direction="column">
                    {list}
                    <Loading show={ledger.loading} delay={100} />
                </Grid>
            </ContentBody>

            <Route exact path={path} component={Hook} />

            {/* 新增 */}
            <Route
                exact
                path={`${path}/add`}
                render={props => (
                    <Add
                        {...props}
                        onSuccessed={() => {
                            ledger.setId(undefined)
                            ledger.setId(ledger.id)
                        }}
                        onClose={() => history.replace(url)}
                    />
                )}
            />

            {/* 编辑 */}
            <Route
                exact
                path={`${path}/edit`}
                render={props => (
                    <Edit
                        {...props}
                        target={edit || {}}
                        onSuccessed={() => {
                            ledger.setId(undefined)
                            ledger.setId(ledger.id)
                        }}
                        onClose={() => setEdit(null)}
                    />
                )}
            />

            {/* 删除 */}
            <Route
                exact
                path={`${path}/remove`}
                render={props => (
                    <Remove
                        {...props}
                        target={remove || {}}
                        onSuccessed={() => {
                            ledger.setId(undefined)
                            ledger.setId(ledger.id)
                        }}
                        onClose={() => setRemove(null)}
                    />
                )}
            />
        </>
    )
}

export default ClassifyIndex
