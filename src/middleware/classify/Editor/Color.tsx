import React from 'react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import Popup from '@/components/Popup'
import Grid from '@/components/Grid'

import { IClassify } from '@/model/types/classify'

import colors from '../Color/colorBg.module.scss'
import styles from './Editor.module.scss'

const Text: React.FC<{
    value: IClassify['color']
    onUpdate: (value: IClassify['color']) => void
}> = props => {
    const { value, onUpdate } = props

    const [show, setShow] = React.useState(false)

    return (
        <>
            <Button
                type="contained"
                color="warn"
                size="medium"
                block
                onClick={() => setShow(true)}
            >
                颜色
            </Button>

            <Popup
                show={show}
                onClose={() => setShow(false)}
                title="选择图标"
                header
                contentPadding
            >
                <Grid container gap={2} justify="center">
                    {(Object.keys(colors) as (keyof typeof colors)[]).map(
                        color => (
                            <Grid key={color}>
                                <Button
                                    className={styles['color-button']}
                                    type={value === color ? 'outlined' : 'text'}
                                    color="default"
                                    border="round"
                                    onClick={() => {
                                        onUpdate(color)
                                        setShow(false)
                                    }}
                                >
                                    <div
                                        className={clsx(
                                            styles['color-block'],
                                            colors[color]
                                        )}
                                    ></div>
                                </Button>
                            </Grid>
                        )
                    )}
                </Grid>
            </Popup>
        </>
    )
}

export default Text
