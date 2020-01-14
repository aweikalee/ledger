import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import { useStore } from '@/store'
import { useRecord } from '@/model/api/record'

import Detail from './Deital'

export interface IRecordIndexDeitalRouteProps {
    id: string
}

const RecordIndex: React.FC<RouteComponentProps<
    IRecordIndexDeitalRouteProps
>> = props => {
    const {
        match: {
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
        </>
    )
}

export default RecordIndex
