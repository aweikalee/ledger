import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { ICurrency } from '../types/currency'

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
                    name
                    cn
                }
            }
        `,
        options
    )
}
