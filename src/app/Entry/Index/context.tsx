import React from 'react'

export default React.createContext<{
    datetime: number
    setDatetime: (value: number) => void
}>({
    datetime: 0,
    setDatetime: () => {}
})
