import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'

import { useStore } from '@/store'

import context from './context'
import DatePicker from './DatePicker'
import CollectionIndex from './Collection/Index'
import LedgerIndex from './Ledger/Index'
import RecordIndex from './Record/Index'

const MainIndex: React.FC<RouteComponentProps> = props => {
    const { ledger } = useStore()

    const data = ledger.data || {}

    /* datetime 为 local 时间戳 */
    const [datetime, setDatetime] = React.useState(Date.now)

    /* deleted 标记已删除的record */
    const [deleted, setDeleted] = React.useState<{ [id: string]: true }>({})
    const pushDeleted = React.useCallback(
        (id: string) => {
            setDeleted(value => {
                return {
                    ...value,
                    [id]: true
                }
            })
        },
        [setDeleted]
    )
    React.useEffect(() => {
        setDeleted({})
    }, [])

    return (
        <context.Provider
            value={{
                datetime,
                setDatetime,
                deleted,
                pushDeleted
            }}
        >
            <NavigationBar
                left={
                    <Button type="text" color="default" href="/collection">
                        <Icon text="ledger" /> {data.title || '账簿'}
                    </Button>
                }
                right={<DatePicker />}
            />

            <Route component={LedgerIndex} />

            <ToolBar
                active={{ main: true }}
                href={{ main: `/ledger/${ledger.id}/add` }}
            />

            <Route path="/collection" component={CollectionIndex} />
            <Route path="/record/:id" component={RecordIndex} />
        </context.Provider>
    )
}

export default MainIndex
