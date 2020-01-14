import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import { useStore } from '@/store'
import { useRecord } from '@/model/api/record'

import Detail from './Deital'
import Remove from './Remove/Index'
import Edit from './Edit/Index'

export interface IRecordIndexDeitalRouteProps {
    id: string
}

const RecordIndex: React.FC<RouteComponentProps<
    IRecordIndexDeitalRouteProps
>> = props => {
    const {
        history,
        match: {
            path,
            url,
            params: { id }
        }
    } = props

    const { ledger } = useStore()
    const record = useRecord({
        variables: {
            id
        },
        skip: !id,
        onCompleted(data) {
            if (data && data.record) {
                if (data.record.pid !== ledger.id) {
                    ledger.setId(data.record.pid)
                }
            }
        }
    })

    return (
        <>
            <Route render={props => <Detail {...props} record={record} />} />
            <Route
                exact
                path={`${path}/edit`}
                render={props => (
                    <Edit
                        {...props}
                        record={record}
                        onClose={() => {
                            history.replace(url)
                        }}
                    />
                )}
            />
            <Route
                path={`${path}/remove`}
                render={props => (
                    <Remove
                        {...props}
                        target={(record.data && record.data.record) || {}}
                        onClose={() => {
                            history.replace(url)
                        }}
                        onSuccessed={() => {
                            history.replace('/')
                            // TODO: 更新列表
                        }}
                    />
                )}
            />
        </>
    )
}

export default RecordIndex
