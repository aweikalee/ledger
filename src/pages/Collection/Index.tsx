import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { TransitionGroup } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import NavigationBar from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import { DelayCSSTransition } from '@/components/Animation'
import * as Loading from '@/components/Loading'
import Ledger, { ILedger } from './components/Ledger'
import styles from './Index.module.scss'

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

    const classnamesItem: CSSTransitionClassNames = {
        enter: styles['item-enter'],
        enterActive: styles['item-enter-active'],
        exit: styles['item-exit'],
        exitActive: styles['item-exit-active']
    }

    return (
        <>
            <NavigationBar title="账簿盒" />
            <ContentBody>
                <TransitionGroup component={Grid} container gap={2}>
                    {data &&
                        (data.ledgers || []).map((item, index) => (
                            <DelayCSSTransition
                                timeout={400}
                                enterDelay={index * 100}
                                exitDelay={0}
                                classNames={classnamesItem}
                                key={item.id}
                            >
                                <Grid item sm={12} md={6}>
                                    <Ledger {...item} />
                                </Grid>
                            </DelayCSSTransition>
                        ))}
                </TransitionGroup>
                {loading && <Loading.Block />}
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default CollectionIndex
