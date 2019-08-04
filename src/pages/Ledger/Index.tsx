import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import Record, { IRecordProps } from './components/Record'
import styles from './Index.module.scss'

const LedgerIndex: React.FC = () => {
    const List = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => {
        const prop: IRecordProps = {
            amount: (Math.random() - 0.5) * 1000,
            currency: 'CNY',
            type: 'traffic',
            timestamp: 1390000000,
            detail: '机票 温州到上海'
        }

        return (
            <Link to="/record/1" className={styles["record-link"]} key={id}>
                <Record {...prop} />
            </Link>
        )
    })
    return (
        <>
            <NavigationBar
                title="旅行账簿"
                subTitle="2019-08-13"
                left={<BackButton text="账簿盒" href="/" />}
            />
            <ContentBody maxWidth="sm">
                <Grid container direction="column">
                    {List}
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default LedgerIndex
