import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import Grid from '@/components/Grid'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Loading from '@/components/Loading'

import { useCurrencies } from '@/model/api/currency'
import { ICurrency } from '@/model/types/currency'

import Add from './Add/Index'
import Edit from './Edit/Index'
import Remove from './Remove/Index'

import styles from './Index.module.scss'

export interface IClassifyIndexProps {}
export interface IClassifyIndexRouteProps {}

const ClassifyIndex: React.FC<RouteComponentProps<IClassifyIndexRouteProps> &
    IClassifyIndexProps> = props => {
    const {
        history,
        match: { path, url }
    } = props

    const { data, loading, refetch } = useCurrencies({
        notifyOnNetworkStatusChange: true
    })

    /* edit, remove */
    const [edit, setEdit] = React.useState<ICurrency | null>(null)
    const [remove, setRemove] = React.useState<ICurrency | null>(null)

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
    const list = ((data && data.currencies) || []).map(currency => (
        <Grid
            className={styles.item}
            key={currency._id}
            alignItems="center"
            alignContent="space-between"
            gap={2}
        >
            <Grid sm>
                <div className={styles.name}>
                    {currency.name} {currency.cn}
                </div>
            </Grid>
            <Grid>
                <Button
                    type="text"
                    color="default"
                    size="large"
                    onClick={() => setRemove(currency)}
                >
                    <Icon text="trash" />
                </Button>
                <Button
                    type="text"
                    color="primary"
                    size="large"
                    onClick={() => setEdit(currency)}
                >
                    <Icon text="pen" />
                </Button>
            </Grid>
        </Grid>
    ))

    return (
        <>
            <NavigationBar
                title="货币管理"
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
                    <Loading show={loading} delay={100} />
                </Grid>
            </ContentBody>

            {/* 新增 */}
            <Route
                exact
                path={`${path}/add`}
                render={props => (
                    <Add
                        {...props}
                        onSuccessed={refetch}
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
                        onSuccessed={refetch}
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
                        onSuccessed={refetch}
                        onClose={() => setRemove(null)}
                    />
                )}
            />
        </>
    )
}

export default ClassifyIndex
