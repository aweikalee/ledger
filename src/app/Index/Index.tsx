import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ToolBar from '@/components/ToolBar'
import { Button } from '@/components/Button'
import { Svg } from '@/components/Icon'

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
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 30 60"
                        >
                            <rect y="4" width="20" height="8" />
                            <rect y="26" width="20" height="8" />
                            <rect y="48" width="20" height="8" />
                        </Svg>
                        {data.title || '账簿'}
                    </Button>
                }
                right={<DatePicker />}
            />

            <Route component={LedgerIndex} />
            <Route path="/collection" component={CollectionIndex} />
            <Route path="/record/:id" component={RecordIndex} />

            <ToolBar
                active={{ main: true }}
                href={{ main: `/ledger/${ledger.id}/add` }}
            />
        </context.Provider>
    )
}

export default MainIndex
