import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import ToolBar from '@/components/ToolBar'

import { useUser } from '@/model/api/user'

import context from './context'
import Index from './Index/Index'
import Currency from './Currency/Index'
import NotFoundRedirect from '../NotFound/Redirect'

const User: React.FC<RouteComponentProps> = props => {
    const {
        match: { path }
    } = props

    const { data, loading } = useUser({})

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
