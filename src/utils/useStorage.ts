import React, { useState } from 'react'

export interface IStorage<T> {
    value: T
    expires?: number
}

const getTimeStamp = (date: Date) => {
    return Math.round(date.getTime() / 1000)
}

const now = getTimeStamp(new Date())

const getStorage = <T>(key: string) => {
    try {
        const data: string | null = localStorage.getItem(key)
        if (data === null) {
            return null
        }

        const result: IStorage<T> = JSON.parse(data)
        const isNotExpiry = !result.expires || result.expires > now

        return isNotExpiry ? result.value : null
    } catch (err) {
        return null
    }
}

const setStorage = <T>(key: string, value: T, expires?: number) => {
    const data: IStorage<T> = { value }

    if (expires) {
        data.expires = getTimeStamp(new Date()) + expires
    }

    localStorage.setItem(key, JSON.stringify(data))
}

export const useStorage = <S>(
    key: string,
    initilState: S
): [
    S,
    (state: React.SetStateAction<S>, expires?: number | undefined) => void
] => {
    const [value, setValueState] = useState<S>(() => {
        const storage = getStorage<S>(key)

        if (storage === null) {
            return typeof initilState === 'function'
                ? initilState()
                : initilState
        } else {
            return storage
        }
    })

    const setValue = (state: React.SetStateAction<S>, expires?: number) => {
        setStorage(key, state, expires)
        setValueState(state)
    }

    return [value, setValue]
}
