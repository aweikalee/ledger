import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

const NotFoundRedirect: React.FC<RouteComponentProps> = props => {
    const { history } = props
    history.replace('/404')
    return null
}

export default NotFoundRedirect
