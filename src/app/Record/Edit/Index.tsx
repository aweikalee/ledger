import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import notification from '@/components/Notification'

import { useStore } from '@/store'
import { onApolloError } from '@/model/error'
import { useRecord } from '@/model/api/record'
import { useUpdateRecordForm } from '@/model/form/record'
import { useUpdateRecord } from '@/model/api/record'
import Editor from '@/middleware/record/Editor'

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

    const defaultValues = React.useMemo(() => (data && data.record) || {}, [
        data
    ])
    const form = useUpdateRecordForm(defaultValues)
    const { getValues, handleSubmit } = form

    const [updateRecord] = useUpdateRecord({
        onError: onApolloError,
        onCompleted() {
            notification.success({
                content: '更新成功'
            })
            history.push('/')
        }
    })

    const onSubmit = () => {
        updateRecord({ variables: { data: getValues() } })
    }

    return (
        <>
            <NavigationBar
                title="编辑账单"
                left={
                    <BackButton
                        icon="close"
                        onClick={() => {
                            history.push('/')
                        }}
                    />
                }
                right={
                    <Button
                        color="default"
                        size="medium"
                        style={{ fontSize: '1.6em' }}
                        onClick={handleSubmit(onSubmit)}
                    >
                        <Icon text="confirm"></Icon>
                    </Button>
                }
            ></NavigationBar>
            <ContentBody>
                <Editor form={form} />
            </ContentBody>
        </>
    )
}

export default RecordEdit
