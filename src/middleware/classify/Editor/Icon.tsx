import React from 'react'

import { Button } from '@/components/Button'
import Icon from '@/components/Icon'
import Popup from '@/components/Popup'
import Grid from '@/components/Grid'

import map from '@/components/Icon/map'

import { IClassify } from '@/model/types/classify'

const Text: React.FC<{
    value: IClassify['icon']
    onUpdate: (value: IClassify['icon']) => void
}> = props => {
    const { value, onUpdate } = props

    const [show, setShow] = React.useState(false)

    return (
        <>
            <Button
                type="contained"
                color="primary"
                size="medium"
                block
                onClick={() => setShow(true)}
            >
                图标
            </Button>

            <Popup
                show={show}
                onClose={() => setShow(false)}
                title="选择图标"
                header
            >
                <Grid container gap={4} justify="center">
                    {(Object.keys(map) as (keyof typeof map)[]).map(icon => (
                        <Grid key={icon}>
                            <Button
                                type="text"
                                color={icon === value ? 'primary' : 'default'}
                                size="medium"
                                onClick={() => {
                                    onUpdate(icon)
                                    setShow(false)
                                }}
                            >
                                <Icon text={icon} />
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Popup>
        </>
    )
}

export default Text
