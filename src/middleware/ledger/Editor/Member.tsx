import React from 'react'

import { Button } from '@/components/Button'

import { ILedger } from '@/model/types/ledger'

const Member: React.FC<{
    value: ILedger['_id']
}> = props => {
    const { value = '' } = props

    return (
        <Button
            href={`/member/${value}`}
            type="contained"
            color="primary"
            size="large"
            block
        >
            管理成员
        </Button>
    )
}

export default Member
