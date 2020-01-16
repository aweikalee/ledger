import React from 'react'

export default React.createContext<{
    datetime: number
    setDatetime: (value: number) => void
    deleted: { [id: string]: true }
    pushDeleted: (id: string) => void
}>({
    datetime: 0,
    setDatetime: () => {},
    deleted: {},
    pushDeleted: () => {}
})
