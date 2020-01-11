import React from 'react'
import Grid from '@/components/Grid'
import Icon from '@/components/Icon'
import styles from './ClassifyPicker.module.scss'
import Button from '@/components/Button'
import color from '../../../style/color.module.scss'
import clsx from 'clsx'
import { IClassify } from '@/model/types/classify'

export interface IClassifyPickerProps {
    data: IClassify[]
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
                    data-active={item._id === active}
                    key={item._id}
                    type="text"
                    color="default"
                    block
                    onClick={() => {
                        item._id && onChange(item._id)
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