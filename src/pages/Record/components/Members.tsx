import React from 'react'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import * as Checkbox from '@/components/Checkbox'
import { ICheckboxProps } from '@/components/Checkbox/Checkbox'
import styles from './Members.module.scss'

import { IMemberEx } from '@/middleware/record/member'

export interface IMembersProps {
    display?: 'icon' | 'checkbox'
    members?: IMemberEx[]
    onUpdate?: (
        type: 'payer' | 'participator' | 'settled',
        value: string
    ) => void
}

const Item: React.FC<ICheckboxProps & {
    display?: IMembersProps['display']
}> = props => {
    const { display = 'icon', ...other }: typeof props = props

    return (
        <Grid sm={4} justify="center">
            {display === 'checkbox' ? (
                <Checkbox.Checkbox {...other} />
            ) : props.checked ? (
                <Icon className={styles.icon} text="confirm" />
            ) : null}
        </Grid>
    )
}

const Members: React.FC<IMembersProps> = props => {
    const {
        display = 'icon',
        members = [],
        onUpdate = () => {}
    }: typeof props = props

    return (
        <Grid container className={styles.list}>
            {members.map(member => (
                <Grid className={styles.item} key={member._id}>
                    <Grid sm>
                        <div className={styles.name}>
                            <Icon text="user"></Icon> {member.name}
                        </div>
                    </Grid>
                    <Grid className={styles.width}>
                        {/* payer */}
                        <Item
                            display={display}
                            checked={member.payer}
                            onClick={() => {
                                onUpdate('payer', member._id || '')
                            }}
                        />

                        {/* participation */}
                        <Item
                            display={display}
                            checked={member.participator}
                            onClick={() => {
                                onUpdate('participator', member._id || '')
                            }}
                        />

                        {/* settled */}
                        <Item
                            display={display}
                            checked={member.settled}
                            onClick={() => {
                                onUpdate('settled', member._id || '')
                            }}
                        />
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )
}

export default Members
