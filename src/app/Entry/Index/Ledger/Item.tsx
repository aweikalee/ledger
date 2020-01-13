import React from 'react'

import { IRecord } from '@/model/types/record'

export interface ILedgerIndexItemProps extends IRecord {}

const LedgerIndexItem: React.FC<ILedgerIndexItemProps> = props => {
    return <div>{props._id}</div>
}

export default LedgerIndexItem
