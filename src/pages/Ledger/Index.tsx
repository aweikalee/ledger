import React, { useState, useRef, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { TransitionGroup } from 'react-transition-group'
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition'
import { format } from 'date-fns'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Grid from '@/components/Grid'
import { DelayCSSTransition } from '@/components/Animation'
import * as Loading from '@/components/Loading'
import { ILoadMoreProps } from '@/components/Loading/More'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import * as DatePicker from '@/components/DatePicker'
import Record from './components/Record'
import styles from './Index.module.scss'
import { IRecord } from '@/types/record'
import { IClassify } from '@/types/classify'
import { timeTransform } from '@/utils/timeZone'
import config from '@/config'

export interface ILedgerIndexRouteProps {
    id: string
}

const LedgerIndex: React.FC<RouteComponentProps<
    ILedgerIndexRouteProps
>> = props => {
    const {
        match: {
            params: { id }
        }
    } = props

    const skip = useRef(0)
    const [datetime, setDatetime] = useState(() => getDateTime(Date.now()))

    /* Records */
    const { loading, fetchMore, data } = useQuery<{
        records?: IRecord[]
    }>(
        gql`
            query($pid: ID!, $datetime: Float, $skip: Float) {
                records(
                    pid: $pid
                    datetime: $datetime
                    skip: $skip
                    limit: 10
                ) {
                    _id
                    type
                    classify
                    timezone
                    datetime
                    detail
                    amount
                    currency
                    rate
                    payer
                    participator
                    settled
                }
            }
        `,
        {
            variables: {
                pid: id,
                datetime: datetime.utc,
                skip: 0
            }
        }
    )
    useEffect(() => {
        if (data && data.records) {
            skip.current = data.records.length
        }
    }, [data])

    const fetchMoreFn: ILoadMoreProps['handler'] = cb => {
        fetchMore({
            variables: {
                skip: skip.current
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (fetchMoreResult) {
                    const records = fetchMoreResult.records
                    return {
                        ...prev,
                        records: [...(prev.records || []), ...(records || [])]
                    }
                } else {
                    return prev
                }
            }
        }).then(res => {
            if (res.errors) {
                cb(res.errors[0])
            } else {
                cb(null, res.data.records && res.data.records!.length === 0)
            }
        })
    }

    /* Types */
    const { data: dataClassifies } = useQuery<{
        classifies: IClassify[]
    }>(
        gql`
            query($pid: ID!) {
                classifies(pid: $pid) {
                    _id
                    text
                    icon
                    color
                }
            }
        `,
        {
            variables: {
                pid: id
            }
        }
    )

    const classnamesItem: CSSTransitionClassNames = {
        enter: styles['item-enter'],
        enterActive: styles['item-enter-active'],
        exit: styles['item-exit'],
        exitActive: styles['item-exit-active']
    }
    const types = (dataClassifies && dataClassifies.classifies) || []

    /* date picker */
    const [showDate, setShowDate] = useState(false)

    return (
        <>
            <NavigationBar
                title="旅行账簿"
                subTitle={format(new Date(datetime.local), config.dateFormat)}
                left={<BackButton text="账簿盒" href="/" />}
                right={
                    <>
                        <Button
                            color="default"
                            size="medium"
                            href={`/ledger/${id}/edit`}
                        >
                            <Icon text="pen"></Icon>
                        </Button>
                        <Button
                            color="default"
                            size="medium"
                            onClick={() => setShowDate(true)}
                        >
                            <Icon text="calendar"></Icon>
                        </Button>
                    </>
                }
            />
            <ContentBody maxWidth="sm">
                <TransitionGroup component={Grid} container direction="column">
                    {data &&
                        data.records &&
                        (data.records || []).map((item, index) => {
                            const delay = (index % 10) * 100 // 10为一页的数量，records请求中的limit
                            return (
                                <DelayCSSTransition
                                    timeout={400}
                                    enterDelay={delay}
                                    exitDelay={0}
                                    classNames={classnamesItem}
                                    key={item._id}
                                >
                                    <Record {...item} classifies={types} />
                                </DelayCSSTransition>
                            )
                        })}
                </TransitionGroup>
                {/* FIXME: 更换日期后 没能重置Loading.More内部状态  */}
                <Loading.More
                    handler={fetchMoreFn}
                    loading={loading}
                    delay={100}
                />
            </ContentBody>
            <ToolBar
                active={{
                    main: true
                }}
                href={{
                    main: `/ledger/${id}/add`
                }}
            />

            {/* 日期选择器 */}
            <DatePicker.Modal
                show={showDate}
                onClickOverlay={() => setShowDate(false)}
            >
                <DatePicker.DatePicker
                    value={new Date(datetime.local)}
                    onConfirm={value => {
                        console.log('fffff')
                        setDatetime(getDateTime(value.getTime()))
                        setShowDate(false)
                    }}
                    disabledHours
                    disabledMinutes
                    disabledSeconds
                ></DatePicker.DatePicker>
            </DatePicker.Modal>
        </>
    )
}

export default LedgerIndex

function getDateTime(now: number) {
    return {
        local: now,
        utc: timeTransform.toUTC(now)
    }
}
