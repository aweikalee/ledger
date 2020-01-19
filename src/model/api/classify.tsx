import {
    useQuery,
    useMutation,
    QueryHookOptions,
    MutationHookOptions
} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IReport } from '../types/graphql'
import { IClassify, ICreateClassify, IUpdateClassify } from '../types/classify'

/* ======================================== */

export interface IClassifysData {
    members: IClassify[] | null
}

export interface IClassifysVar {
    pid: string
}

export const useClassifies = (
    options: QueryHookOptions<IClassifysData, IClassifysVar>
) => {
    return useQuery<IClassifysData, IClassifysVar>(
        gql`
            query($pid: ID!) {
                classifies(pid: $pid) {
                    _id
                    text
                    icon
                    color
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface ICreateClassifyData {
    createClassify: IReport | null
}

export interface ICreateClassifyVar {
    data: ICreateClassify
}

export const useCreateClassify = (
    options: MutationHookOptions<ICreateClassifyData, ICreateClassifyVar>
) => {
    return useMutation<ICreateClassifyData, ICreateClassifyVar>(
        gql`
            mutation($data: CreateClassify) {
                createClassify(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}

/* ======================================== */

export interface IUpdateClassifyData {
    updateClassify: IReport | null
}

export interface IUpdateClassifyVar {
    data: IUpdateClassify
}

export const useUpdateClassify = (
    options: MutationHookOptions<IUpdateClassifyData, IUpdateClassifyVar>
) => {
    return useMutation<IUpdateClassifyData, IUpdateClassifyVar>(
        gql`
            mutation($data: UpdateClassify) {
                updateClassify(data: $data) {
                    code
                    message
                }
            }
        `,
        options
    )
}
