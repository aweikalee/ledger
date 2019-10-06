import React from 'react'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import styles from './ClassifyPicker.module.scss'
import Button from '@/components/Button'
import { IRecordType } from './Record'
import color from '../../../style/color.module.scss'
import clsx from 'clsx'

export interface IClassifyPickerProps {
    data: IRecordType[]
    active: string
    onChange: (id: string) => void
}

const ClassifyPicker: React.FC<IClassifyPickerProps> = props => {
    const { data = [], active, onChange = () => {} }: typeof props = props

    return (
        <div className={styles.container}>
            {data.map(item => (
                <Button
                    className={styles.item}
                    data-active={item.id === active}
                    key={item.id}
                    type="text"
                    color="default"
                    block
                    onClick={() => {
                        onChange(item.id)
                    }}
                >
                    <Grid
                        className={clsx(styles.icon, color[`${item.color}-bg`])}
                        justify="center"
                        alignItems="center"
                    >
                        <Icon text="image"></Icon>
                    </Grid>
                    <div className={styles.text}>{item.text}</div>
                </Button>
            ))}
        </div>
    )
}

export default ClassifyPicker
