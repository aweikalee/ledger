import React, { useState, useRef, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
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

import config from '@/config'
import { onApolloError } from '@/model/error'
import { timeTransform } from '@/utils/timeZone'
import { useLedger } from '@/model/api/ledger'
import { useRecords } from '@/model/api/record'

import Record from './components/Record'
import styles from './Index.module.scss'

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

    /* Ledger */
    const { data: ledger } = useLedger({
        variables: { id },
        fetchPolicy: 'cache-and-network'
    })

    /* Records */
    const skip = useRef(0)
    const [datetime, setDatetime] = useState(() => {
        const now = new Date()
        now.setHours(0)
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)
        return getDateTime(now.getTime())
    })

    const { loading, fetchMore, data } = useRecords({
        variables: {
            pid: id,
            datetime: datetime.utc,
            skip: 0,
            limit: 20
        },
        onError: onApolloError,
        fetchPolicy: 'cache-and-network'
    })
    useEffect(() => {
        if (data && data.records) {
            skip.current = data.records.length
        }
    }, [data])
    // FIXME: 再次访问该页面，会使用缓存信息，而非重新获取

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
                cb(null, !!res.data.records && res.data.records.length === 0)
            }
        })
    }

    const classnamesItem: CSSTransitionClassNames = {
        enter: styles['item-enter'],
        enterActive: styles['item-enter-active'],
        exit: styles['item-exit'],
        exitActive: styles['item-exit-active']
    }
    const types = (ledger && ledger.ledger && ledger.ledger.classifies) || []

    /* date picker */
    const [showDate, setShowDate] = useState(false)

    return (
        <>
            <NavigationBar
                title={(ledger && ledger.ledger && ledger.ledger.title) || ''}
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
                    {data && data.records ? (
                        data.records.map((item, index) => {
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
                        })
                    ) : (
                        <></>
                    )}
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
