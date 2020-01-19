import React from 'react'
import { RouteComponentProps, Route } from 'react-router-dom'

import ToolBar from '@/components/ToolBar'

import Index from './Index/Index'

export interface IClassifyProps {}
export interface IClassifyRouteProps {
    id: string
}

const Classify: React.FC<RouteComponentProps<IClassifyRouteProps> &
    IClassifyProps> = props => {
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

export default Classify
