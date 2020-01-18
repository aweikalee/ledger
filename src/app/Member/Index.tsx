import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import ToolBar from '@/components/ToolBar'

import Index from './Index/Index'

export interface IMembersProps {}
export interface IMembersRouteProps {
    id: string
}

const Member: React.FC<RouteComponentProps<IMembersRouteProps> &
    IMembersProps> = props => {
    const {
        match: { path }
    } = props

    return (
        <>
            <Route path={`${path}/:id`} component={Index} />

            <ToolBar />
        </>
    )
}

export default Member
