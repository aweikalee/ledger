import {
    useQuery,
    useMutation,
    QueryHookOptions,
    MutationHookOptions
} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IReport } from '../types/graphql'
import { IMember, ICreateMember, IUpdateMember } from '../types/member'

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

/* ======================================== */

export interface ICreateMemberData {
    createMember: IReport | null
}

export interface ICreateMemberVar {
    data: ICreateMember
}

export const useCreateMember = (
    options: MutationHookOptions<ICreateMemberData, ICreateMemberVar>
) => {
    return useMutation<ICreateMemberData, ICreateMemberVar>(
        gql`
            mutation($data: CreateMember) {
                createMember(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IUpdateMemberData {
    updateMember: IReport | null
}

export interface IUpdateMemberVar {
    data: IUpdateMember
}

export const useUpdateMember = (
    options: MutationHookOptions<IUpdateMemberData, IUpdateMemberVar>
) => {
    return useMutation<IUpdateMemberData, IUpdateMemberVar>(
        gql`
            mutation($data: UpdateMember) {
                updateMember(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}
