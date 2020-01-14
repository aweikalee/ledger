import React from 'react'

import { useRecord } from '@/model/api/record'

export default React.createContext<{
    record?: ReturnType<typeof useRecord>
}>({})
