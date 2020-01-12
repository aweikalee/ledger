import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Button from '@/components/Button'
import Drawer from '@/components/Drawer'
import Grid from '@/components/Grid'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useLedgers } from '@/model/api/ledger'

export interface ICollectionIndexProps {}

const CollectionIndex: React.FC<RouteComponentProps<
    ICollectionIndexProps
>> = props => {
    const { history } = props

    const store = useStore()

    const { data: ledgers } = useLedgers({
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })

    const [show, setShow] = React.useState(true)

    return (
        <>
            <Drawer
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
                <Grid container direction="column" gap={2}>
                    {((ledgers && ledgers.ledgers) || []).map(ledger => (
                        <Grid key={ledger._id}>
                            <Button
                                href={`ledger/${ledger._id}`}
                                type="contained"
                                color="primary"
                                size="medium"
                                block
                            >
                                {ledger.title}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Drawer>
        </>
    )
}

export default CollectionIndex
