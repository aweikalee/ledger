import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useStore } from '@/store'

export interface IUserTokenRouteProps {
    token: string
}

const UserToken: React.FC<RouteComponentProps<
    IUserTokenRouteProps
>> = props => {
    const {
        history,
        match: {
            params: { token }
        }
    } = props

    const { user } = useStore()

    user.setToken(urlDecode(token), 30 * 24 * 60 * 60 * 1000)
    history.replace('/')

    return null
}

export default UserToken

function urlDecode(value: string) {
    const mod = value.length % 4
    const fillerCount = mod === 0 ? 0 : 4 - mod
    let filler = ''
    for (let i = 0; i < fillerCount; i += 1) {
        filler += '='
    }

    const base64Str = `${value}${filler}`.replace(/-/g, '+').replace(/_/g, '/')

    return base64Str
}
