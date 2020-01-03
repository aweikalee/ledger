import React from 'react'
import { RouteComponentProps } from 'react-router'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { notification } from '@/components/Notification'

import { useStore } from '@/store'

import { IReport } from '@/model/types/graphql'

export interface IForm {
    username: string
    token: string
}

const UserLogin: React.FC<RouteComponentProps> = props => {
    const { history } = props

    const store = useStore()

    const [sendLogout] = useMutation<
        {
            logout: IReport
        },
        {
            data: IForm
        }
    >(
        gql`
            mutation($data: LogoutInput) {
                logout(data: $data) {
                    code
                    message
                }
            }
        `
    )

    React.useEffect(() => {
        /* 给服务端发送登出请求 不用管是否成功 */
        sendLogout({
            variables: {
                data: {
                    username: store.username,
                    token: store.token
                }
            }
        })

        /* 重置本地设置 */
        store.setNickname('')
        store.setToken('')

        /* 提示 */
        notification.info({
            content: '已登出'
        })

        /* 跳转 */
        history.push('/login')

        // eslint-disable-next-line
    }, [])

    return <div></div>
}

export default UserLogin
