import React from 'react'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import styles from './MemberList.module.scss'
import * as Checkbox from '@/components/Checkbox'

export interface IMember {
    id: string
    name: string
}

export interface ITypePickerProps {
    members?: IMember[]
    payer?: string[]
    participator?: string[]
    settled?: string[]
    onUpdate?: (
        type: 'payer' | 'participator' | 'settled',
        value: string
    ) => void
}

const MemberList: React.FC<ITypePickerProps> = props => {
    const {
        members = [
            {
                id: '1',
                name: '刘德华'
            },
            {
                id: '2',
                name: '刘德华'
            }
        ],
        payer = ['1'],
        participator = [],
        settled = [],
        onUpdate = () => {}
    }: typeof props = props

    return (
        <Grid container className={styles.list}>
            {members.map(member => (
                <Grid className={styles.item} key={member.id}>
                    <Grid sm>
                        <div className={styles.name}>
                            <Icon text="user"></Icon> {member.name}
                        </div>
                    </Grid>
                    <Grid className={styles.checkbox}>
                        {/* payer */}
                        <Grid sm={4} justify="center">
                            <Checkbox.Checkbox
                                checked={payer.includes(member.id)}
                                onClick={() => {
                                    onUpdate('payer', member.id)
                                }}
                            ></Checkbox.Checkbox>
                        </Grid>

                        {/* participation */}
                        <Grid sm={4} justify="center">
                            <Checkbox.Checkbox
                                checked={participator.includes(member.id)}
                                onClick={() => {
                                    onUpdate('participator', member.id)
                                }}
                            ></Checkbox.Checkbox>
                        </Grid>

                        {/* settled */}
                        <Grid sm={4} justify="center">
                            <Checkbox.Checkbox
                                checked={settled.includes(member.id)}
                                onClick={() => {
                                    onUpdate('settled', member.id)
                                }}
                            ></Checkbox.Checkbox>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )
}

export default MemberList
