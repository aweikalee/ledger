import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Drawer from '@/components/Drawer'
import Grid from '@/components/Grid'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useLedgers } from '@/model/api/ledger'
import { ILedger } from '@/model/types/ledger'

import LedgerAdd from './Add/Index'
import LedgerRemove from './Remove/Index'
import styles from './Index.module.scss'

export interface ICollectionIndexProps {}

const CollectionIndex: React.FC<RouteComponentProps<
    ICollectionIndexProps
>> = props => {
    const {
        history,
        match: { path }
    } = props

    const store = useStore()

    const [show, setShow] = React.useState(true)
    const [edit, setEdit] = React.useState(false)
    const [remove, setRemove] = React.useState<ILedger | null>(null)
    React.useEffect(() => {
        if (remove) {
            history.push(`${path}/remove`)
        } else {
            history.replace(path)
        }
    }, [remove, history, path])

    const { data: ledgers, refetch } = useLedgers({
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    const ledgersList = ((ledgers && ledgers.ledgers) || []).map(ledger => (
        <Grid key={ledger._id}>
            <Grid sm>
                <Button
                    href={`/ledger/${ledger._id}${edit ? '/edit' : ''}`}
                    type="contained"
                    color="primary"
                    size="medium"
                    border="round"
                    block
                >
                    {ledger.title}
                </Button>
            </Grid>

            {/* 删除按钮 */}
            {edit && (
                <Grid>
                    <Button
                        type="text"
                        color="default"
                        size="medium"
                        border="full"
                        title="删除"
                        onClick={() => {
                            setRemove(ledger)
                        }}
                    >
                        <Icon text="trash" />
                    </Button>
                </Grid>
            )}
        </Grid>
    ))

    return (
        <>
            <Drawer
                className={styles.drawer}
                anchor="left"
                show={show}
                onClickOverlay={() => {
                    setShow(false)
                }}
                onExited={() => {
                    history.replace(
                        store.lastLedger ? `ledger/${store.lastLedger}` : '/'
                    )
                }}
            >
                {/* 列表 */}
                <Grid container direction="column" gap={2}>
                    {ledgersList}
                </Grid>

                {/* 新增按钮、编辑按钮 */}
                <Grid
                    container
                    className={styles.bottom}
                    justify="space-around"
                >
                    <Grid>
                        <Button
                            href={`${path}/add`}
                            type="contained"
                            color="primary"
                            size="medium"
                            border="full"
                            title="新增"
                        >
                            <Icon text="plus" />
                        </Button>
                    </Grid>
                    <Grid>
                        <Button
                            type={edit ? 'contained' : 'outlined'}
                            color="default"
                            size="medium"
                            border="full"
                            title="编辑"
                            onClick={() => setEdit(!edit)}
                        >
                            <Icon text="pen" />
                        </Button>
                    </Grid>
                </Grid>
            </Drawer>

            {/* 新增 */}
            <Route
                exact
                path={`${path}/add`}
                render={props => (
                    <LedgerAdd
                        {...props}
                        onSuccessed={refetch}
                        onClose={() => {
                            history.replace(path)
                        }}
                    />
                )}
            />

            {/* 删除 */}
            <Route
                exact
                path={`${path}/remove`}
                render={props => (
                    <LedgerRemove
                        {...props}
                        target={remove || {}}
                        onSuccessed={refetch}
                        onClose={() => {
                            setRemove(null)
                        }}
                    />
                )}
            />
        </>
    )
}

export default CollectionIndex