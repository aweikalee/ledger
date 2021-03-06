import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import { useStore } from '@/store'
import { useRecord } from '@/model/api/record'
import { onApolloServerError } from '@/model/error/ApolloError'

import context from './context'
import Detail from './Detail'
import Remove from './Remove/Index'

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
        onError: onApolloServerError({
            CastError() {}
        }),
        onCompleted(data) {
            if (data && data.record) {
                if (data.record.pid !== ledger.id) {
                    ledger.setId(data.record.pid)
                }
            }
        }
    })

    return (
        <context.Provider
            value={{
                record
            }}
        >
            <Route
                render={props => (
                    <Detail
                        {...props}
                        onClose={() => {
                            history.push('/')
                        }}
                    />
                )}
            />

            <Route
                path={`${path}/remove`}
                render={props => (
                    <Remove
                        {...props}
                        onClose={() => {
                            history.replace(url)
                        }}
                        onSuccessed={() => {
                            history.replace('/')
                        }}
                    />
                )}
            />
        </context.Provider>
    )
}

export default RecordIndex
