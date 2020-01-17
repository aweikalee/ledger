import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IUser } from '../types/user'

/* ======================================== */

export interface IUserData {
    user: IUser | null
}

export interface IUserVar {}

export const useUser = (options: QueryHookOptions<IUserData, IUserVar>) => {
    return useQuery<IUserData, IUserVar>(
        gql`
            query {
                user {
                    _id
                    nickname
                    profile_picture
                }
            }
        `,
        options
    )
}
