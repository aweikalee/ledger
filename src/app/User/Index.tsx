import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import ToolBar from '@/components/ToolBar'
import notification from '@/components/Notification'

import { useUser } from '@/model/api/user'
import { onApolloError } from '@/model/error/ApolloError'

import context from './context'
import Index from './Index/Index'
import Currency from './Currency/Index'
import NotFoundRedirect from '../NotFound/Redirect'

const User: React.FC<RouteComponentProps> = props => {
    const {
        history,
        match: { path }
    } = props

    const { data, loading } = useUser({
        onError: onApolloError,
        onCompleted(data) {
            if (data && data.user === null) {
                notification.error({
                    content: '用户信息获取失败'
                })
                history.replace('/login')
            }
        }
    })

    return (
        <context.Provider
            value={{
                user: (data && data.user) || null,
                loading
            }}
        >
            <Switch>
                <Route exact path={path} component={Index} />

                {data && data.user && data.user.admin === true && (
                    <Route path={`${path}/currency`} component={Currency} />
                )}
                <Route component={NotFoundRedirect} />
            </Switch>

            <ToolBar active={{ user: true }} />
        </context.Provider>
    )
}

export default User
