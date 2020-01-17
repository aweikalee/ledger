import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router-dom'

import NavigationBar from '@/components/NavigationBar'
import ToolBar from '@/components/ToolBar'

import Index from './Index/Index'

const User: React.FC<RouteComponentProps> = props => {
    const {
        match: { path }
    } = props
    return (
        <>
            <Switch>
                <Route exact path={path} component={Index} />
            </Switch>

            <ToolBar
                active={{ user: true }}
            />
        </>
    )
}

export default User
