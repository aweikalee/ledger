import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'

import { useStore } from '@/store'

import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'

const MainIndex: React.FC<RouteComponentProps> = props => {
    const { ledger } = useStore()

    const data = ledger.data || {}

    return (
        <>
            <NavigationBar
                left={
                    <Button type="text" color="default" href="/collection">
                        {data.title}
                    </Button>
                }
            />

            <Route component={LedgerIndex} />

            <ToolBar
                active={{ main: true }}
                href={{ main: `/ledger/${ledger.id}/add` }}
            />

            <Route path="/collection" component={CollectionIndex} />
            <Route path="/record/:id" component={RecordIndex} />
        </>
    )
}

export default MainIndex
