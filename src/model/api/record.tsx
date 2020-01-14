import {
    useQuery,
    useMutation,
    QueryHookOptions,
    MutationHookOptions
} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IReport } from '../types/graphql'
import { IRecord, ICreateRecord, IUpdateRecord } from '../types/record'

/* ======================================== */

export interface IRecordData {
    record: IRecord | null
}

export interface IRecordVar {
    id: string
}

export const useRecord = (
    options: QueryHookOptions<IRecordData, IRecordVar>
) => {
    return useQuery<IRecordData, IRecordVar>(
        gql`
            query($id: ID!) {
                record(id: $id) {
                    _id
                    pid
                    type
                    classify
                    timezone
                    datetime
                    detail
                    amount
                    currency
                    rate
                    payer
                    participator
                    settled
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IRecordsData {
    records: IRecord[] | null
}

export interface IRecordsVar {
    pid: string
    start: number
    end: number
    skip: number
    limit: number
}

export const useRecords = (
    options: QueryHookOptions<IRecordsData, IRecordsVar>
) => {
    return useQuery<IRecordsData, IRecordsVar>(
        gql`
            query(
                $pid: ID!
                $start: Float
                $end: Float
                $skip: Float
                $limit: Float
            ) {
                records(
                    pid: $pid
                    start: $start
                    end: $end
                    skip: $skip
                    limit: $limit
                ) {
                    _id
                    type
                    classify
                    timezone
                    datetime
                    detail
                    amount
                    currency
                    rate
                    payer
                    participator
                    settled
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface ICreateRecordData {
    createRecord: IReport | null
}

export interface ICreateRecordVar {
    data: ICreateRecord
}

export const useCreateRecord = (
    options: MutationHookOptions<ICreateRecordData, ICreateRecordVar>
) => {
    return useMutation<ICreateRecordData, ICreateRecordVar>(
        gql`
            mutation($data: CreateRecord) {
                createRecord(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IUpdateRecordData {
    updateRecord: IReport | null
}

export interface IUpdateRecordVar {
    data: IUpdateRecord
}

export const useUpdateRecord = (
    options: MutationHookOptions<IUpdateRecordData, IUpdateRecordVar>
) => {
    return useMutation<IUpdateRecordData, IUpdateRecordVar>(
        gql`
            mutation($data: UpdateRecord) {
                updateRecord(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}
