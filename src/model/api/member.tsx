import { useQuery, QueryHookOptions } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IMember } from '../types/member'

/* ======================================== */

export interface IMembersData {
    members: IMember[] | null
}

export interface IMembersVar {
    pid: string
}

export const useMembers = (
    options: QueryHookOptions<IMembersData, IMembersVar>
) => {
    return useQuery<IMembersData, IMembersVar>(
        gql`
            query($pid: ID!) {
                members(pid: $pid) {
                    _id
                    name
                }
            }
        `,
        options
    )
}
