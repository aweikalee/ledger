import React from 'react'

import { IUser } from '@/model/types/user'

export default React.createContext<{
    user: IUser | null
    loading: boolean
}>({
    user: null,
    loading: true
})
