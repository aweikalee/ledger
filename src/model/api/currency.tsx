import {
    useQuery,
    useMutation,
    QueryHookOptions,
    MutationHookOptions
} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IReport } from '../types/graphql'
import { ICurrency, ICreateCurrency, IUpdateCurrency } from '../types/currency'

/* ======================================== */

export interface ICurrenciesData {
    currencies: ICurrency[] | null
}

export interface ICurrenciesVar {}

export const useCurrencies = (
    options: QueryHookOptions<ICurrenciesData, ICurrenciesVar>
) => {
    return useQuery<ICurrenciesData, ICurrenciesVar>(
        gql`
            query {
                currencies {
                    _id
                    name
                    cn
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface ICreateCurrencyData {
    createCurrency: IReport | null
}

export interface ICreateCurrencyVar {
    data: ICreateCurrency
}

export const useCreateCurrency = (
    options: MutationHookOptions<ICreateCurrencyData, ICreateCurrencyVar>
) => {
    return useMutation<ICreateCurrencyData, ICreateCurrencyVar>(
        gql`
            mutation($data: CreateCurrency) {
                createCurrency(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IUpdateCurrencyData {
    updateCurrency: IReport | null
}

export interface IUpdateCurrencyVar {
    data: IUpdateCurrency
}

export const useUpdateCurrency = (
    options: MutationHookOptions<IUpdateCurrencyData, IUpdateCurrencyVar>
) => {
    return useMutation<IUpdateCurrencyData, IUpdateCurrencyVar>(
        gql`
            mutation($data: UpdateCurrency) {
                updateCurrency(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}
