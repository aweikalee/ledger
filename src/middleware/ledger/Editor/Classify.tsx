import React from 'react'

import { Button } from '@/components/Button'

import { ILedger } from '@/model/types/ledger'

const Classify: React.FC<{
    value: ILedger['_id']
}> = props => {
    const { value = '' } = props

    return (
        <Button
            href={`/classify/${value}`}
            type="contained"
            color="primary"
            size="large"
            block
        >
            管理分类
        </Button>
    )
}

export default Classify
