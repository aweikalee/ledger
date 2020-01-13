import {
    useQuery,
    useMutation,
    QueryHookOptions,
    MutationHookOptions,
    useLazyQuery,
    LazyQueryHookOptions
} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IReport } from '../types/graphql'
import { ILedger, ICreateLedger, IUpdateLedger } from '../types/ledger'

/* ======================================== */

export interface ILedgerData {
    ledger: ILedger | null
}

export interface ILedgerVar {
    id: string
}

export const useLedger = (
    options: QueryHookOptions<ILedgerData, ILedgerVar>
) => {
    return useQuery<ILedgerData, ILedgerVar>(
        gql`
            query($id: ID!) {
                ledger(id: $id) {
                    _id
                    title
                    classifies {
                        _id
                        text
                        icon
                        color
                    }
                    members {
                        _id
                        name
                    }
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface ILedgersData {
    ledgers: ILedger[] | null
}

export interface ILedgersVar {}

export const useLedgers = (
    options: QueryHookOptions<ILedgersData, ILedgersVar>
) => {
    return useQuery<ILedgersData, ILedgersVar>(
        gql`
            query {
                ledgers {
                    _id
                    title
                    sort
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IFristLedgerData {
    firstLedger: ILedger | null
}

export interface IFristLedgerVar {}

export const useLazyFristLedger = (
    options: LazyQueryHookOptions<IFristLedgerData, IFristLedgerVar>
) => {
    return useLazyQuery<IFristLedgerData, IFristLedgerVar>(
        gql`
            query {
                firstLedger {
                    _id
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface ICreateLedgerData {
    createLedger: IReport | null
}

export interface ICreateLedgerVar {
    data: ICreateLedger
}

export const useCreateLedger = (
    options: MutationHookOptions<ICreateLedgerData, ICreateLedgerVar>
) => {
    return useMutation<ICreateLedgerData, ICreateLedgerVar>(
        gql`
            mutation($data: CreateLedger) {
                createLedger(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IUpdateLedgerData {
    updateLedger: IReport | null
}

export interface IUpdateLedgerVar {
    data: IUpdateLedger
}

export const useUpdateLedger = (
    options: MutationHookOptions<IUpdateLedgerData, IUpdateLedgerVar>
) => {
    return useMutation<IUpdateLedgerData, IUpdateLedgerVar>(
        gql`
            mutation($data: UpdateLedger) {
                updateLedger(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}
