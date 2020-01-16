import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'

import { useStore } from '@/store'
import { useRecord } from '@/model/api/record'

import useForm from './useForm'

export interface IRecordEditRouteProps {
    id: string
}
export interface IRecordEditProps {}

const RecordEdit: React.FC<RouteComponentProps<IRecordEditRouteProps> &
    IRecordEditProps> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    const { ledger } = useStore()
    const { data } = useRecord({
        variables: {
            id
        },
        skip: !id,
        onCompleted(data) {
            if (data && data.record) {
                if (data.record.pid !== ledger.id) {
                    ledger.setId(data.record.pid)
                }
            }
        }
    })

    const form = useForm((data && data.record) || {})

    return (
        <>
            <NavigationBar
                title="编辑账单"
                left={
                    <BackButton
                        icon="close"
                        onClick={() => {
                            history.push(`/record/${id}`)
                        }}
                    />
                }
                right={
                    <Button
                        color="default"
                        size="medium"
                        style={{ fontSize: '1.6em' }}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            ></NavigationBar>
            <ContentBody></ContentBody>
        </>
    )
}

export default RecordEdit
