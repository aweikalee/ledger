import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'

import { useStore } from '@/store'
import { timeTransform } from '@/utils/timeZone'
import * as process from '@/middleware/record/process'

import DatePicker from './DatePicker'
import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'

const MainIndex: React.FC<RouteComponentProps> = props => {
    const { ledger } = useStore()

    const data = ledger.data || {}

    /* datetime 为 local 时间戳 */
    const [datetime, setDatetime] = React.useState(() => {
        return getDatetime(Date.now())
    })

    return (
        <>
            <NavigationBar
                left={
                    <Button type="text" color="default" href="/collection">
                        {data.title}
                    </Button>
                }
                right={
                    <DatePicker
                        datetime={datetime.start}
                        setDatetime={value => {
                            setDatetime(getDatetime(value))
                        }}
                    />
                }
            />

            <Route
                render={props => (
                    <LedgerIndex
                        {...props}
                        start={datetime.start}
                        end={datetime.end}
                    />
                )}
            />

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

function getDatetime(value: number) {
    const [start, end] = process.getMonthRange(value)
    return {
        start: timeTransform.toUTC(start),
        end: timeTransform.toUTC(end)
    }
}
