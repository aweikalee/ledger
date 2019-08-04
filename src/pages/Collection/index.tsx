import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Ledger from './components/Ledger'
import styles from './Index.module.scss'

const CollectionIndex: React.FC = () => {
    const ledgerItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
        <Grid item sm={12} md={6} key={id}>
            <Link to="/ledger/1" className={styles['ledger-link']}>
                <Ledger />
            </Link>
        </Grid>
    ))
    return (
        <>
            <NavigationBar title="账簿盒" />
            <ContentBody>
                <Grid container gap={2}>
                    {ledgerItems}
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default CollectionIndex
