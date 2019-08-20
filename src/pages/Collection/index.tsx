import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Ledger, { ILedger } from './components/Ledger'
import { LoadingBlock } from '@/components/Loading'

const CollectionIndex: React.FC = () => {
    const { loading, data } = useQuery<{
        ledgers: ILedger[]
    }>(gql`
        query {
            ledgers {
                id
                title
            }
        }
    `)

    const ledgerItems =
        data &&
        data.ledgers &&
        data.ledgers.map(item => (
            <Grid item sm={12} md={6} key={item.id}>
                <Ledger {...item} />
            </Grid>
        ))
    return (
        <>
            <NavigationBar title="账簿盒" />
            <ContentBody>
                {loading ? (
                    <LoadingBlock />
                ) : (
                    <Grid container gap={2}>
                        {ledgerItems}
                    </Grid>
                )}
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default CollectionIndex
