import React from 'react'
import { Route } from 'react-router-dom'

import ContentBody from '@/components/ContentBody'

import Detail from './Detail'

const NotFound: React.FC = props => {
    return (
        <ContentBody style={{paddingTop: '20vh', paddingBottom: '20vh'}}>
            <Route component={Detail} />
        </ContentBody>
    )
}

export default NotFound
