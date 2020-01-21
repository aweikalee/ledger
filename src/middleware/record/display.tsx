import React from 'react'
import clsx from 'clsx'

import Grid, { IGirdProps } from '@/components/Grid/Grid'
import Checkbox, { ICheckboxProps } from '@/components/Checkbox/Checkbox'
import IconComponet from '@/components/Icon'

import { ILedger } from '@/model/types/ledger'
import { IRecord } from '@/model/types/record'
import { IClassify } from '@/model/types/classify'

import * as process from './process'
import ClassifyIcon from '../classify/Icon'
import * as classifyProcess from '../classify/process'

import styles from './styles.module.scss'
import colorBg from '../classify/Color/colorBg.module.scss'

/* ======================================== */

export interface IRecordIconProps extends IGirdProps {
    classify: IClassify
}

export const Icon: React.FC<IRecordIconProps> = props => {
    const { className, classify, ...other } = props
    return (
        <Grid
            className={clsx(styles.icon, colorBg[classify.color!], className)}
            justify="center"
            alignItems="center"
            {...other}
        >
            <ClassifyIcon text={classify.icon} />
        </Grid>
    )
}

/* ======================================== */

export interface IRecordDatetimeProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    datetime?: IRecord['datetime']
    format?: string
}
export const Datetime: React.FC<IRecordDatetimeProps> = props => {
    const { datetime, format = 'yyyy-MM-dd HH:mm:ss', ...other } = props

    if (!datetime) {
        return null
    }

    return (
        <span title={process.datetime(datetime)} {...other}>
            {process.datetime(datetime, format)}
        </span>
    )
}

/* ======================================== */

export interface IRecordTimezoneProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    timezone?: IRecord['timezone']
}
export const Timezone: React.FC<IRecordTimezoneProps> = props => {
    const { className, timezone, ...other } = props

    const utc = process.timezone(timezone)

    return !utc ? null : (
        <span className={clsx(styles.timezone, className)} {...other}>
            {utc}
        </span>
    )
}

/* ======================================== */

export interface IRecordAmountProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    type?: IRecord['type']
    amount?: IRecord['amount']
}
export const Amount: React.FC<IRecordAmountProps> = props => {
    const { className, type, amount, ...other } = props

    const [amountInt, amountFloat] = process.amount(type, amount)

    return (
        <span
            className={clsx(styles.amount, className)}
            data-type={type || 0}
            {...other}
        >
            {amountInt}
            <span data-float>{amountFloat}</span>
        </span>
    )
}

/* ======================================== */

export interface IRecordMembersProps extends IGirdProps {
    display?: 'icon' | 'checkbox'
    members?: ILedger['members']
    payer?: IRecord['payer']
    participator?: IRecord['participator']
    settled?: IRecord['settled']
    onUpdate?: (
        type: 'payer' | 'participator' | 'settled',
        value: string
    ) => void
}

const MemberItem: React.FC<ICheckboxProps & {
    display?: IRecordMembersProps['display']
}> = props => {
    const { display = 'icon', ...other }: typeof props = props

    return (
        <Grid sm={4} justify="center">
            {display === 'checkbox' ? (
                <Checkbox {...other} />
            ) : props.checked ? (
                <IconComponet data-members-icon text="confirm" />
            ) : null}
        </Grid>
    )
}

export const Members: React.FC<IRecordMembersProps> = props => {
    const {
        className,
        display = 'icon',
        members = [],
        payer = [],
        participator = [],
        settled = [],
        onUpdate,
        ...other
    }: typeof props = props

    const data = process.members({
        members,
        payer,
        participator,
        settled
    })

    if (data.length === 0) {
        return null
    }

    return (
        <Grid className={styles.members} {...other}>
            {data.map(member => (
                <Grid data-members-item key={member._id}>
                    <Grid sm>
                        <div data-members-name>
                            <IconComponet text="user" /> {member.name}
                        </div>
                    </Grid>
                    <Grid className={styles['members-width']}>
                        {/* payer */}
                        <MemberItem
                            display={display}
                            checked={member.payer}
                            onClick={() => {
                                onUpdate && onUpdate('payer', member._id || '')
                            }}
                        />

                        {/* participation */}
                        <MemberItem
                            display={display}
                            checked={member.participator}
                            onClick={() => {
                                onUpdate &&
                                    onUpdate('participator', member._id || '')
                            }}
                        />

                        {/* settled */}
                        <MemberItem
                            display={display}
                            checked={member.settled}
                            onClick={() => {
                                onUpdate &&
                                    onUpdate('settled', member._id || '')
                            }}
                        />
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )
}
