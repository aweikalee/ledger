import BigNumberOrigin from 'bignumber.js'
import { useState, useMemo, useRef, useEffect } from 'react'
import { SYMBOL_NUMBER, SYMBOL_OPERATOR } from './config'

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

const OPERATOR: (keyof typeof SYMBOL_OPERATOR)[] = ['+', '-', '*', '/']

const TO_BIGNUMBER_OPERATOR: {
    [key in keyof typeof SYMBOL_OPERATOR]:
        | 'multipliedBy'
        | 'dividedBy'
        | 'plus'
        | 'minus'
} = {
    '*': 'multipliedBy',
    '/': 'dividedBy',
    '+': 'plus',
    '-': 'minus'
}

export type IQueue = string[]

export interface ISetQueue {
    addNumber(number: keyof typeof SYMBOL_NUMBER): void
    addOperator(operator: keyof typeof SYMBOL_OPERATOR): void
    backspace(): void
    clear(): void
    equals(callback?: (result: string) => void): void
    isAllClear(): boolean
}

const isNumberString = (number: string) => {
    return !/[^0-9.-]/.test(number) && !/^-$/.test(number)
}

const addNumber = (theQueue: IQueue, number: keyof typeof SYMBOL_NUMBER) => {
    const queue = [...theQueue]
    const last = queue.pop()!
    if (number === '.') {
        if (isNumberString(last)) {
            if (last.indexOf('.') === -1) {
                queue.push(`${last}.`)
            } else {
                queue.push(last)
            }
        } else {
            queue.push(last, '0.')
        }
    } else {
        if (isNumberString(last)) {
            if (last === '0') {
                queue.push(`${number}`)
            } else {
                queue.push(`${last}${number}`)
            }
        } else {
            queue.push(last, `${number}`)
        }
    }
    return queue
}

const addOperator = (
    theQueue: IQueue,
    operator: keyof typeof SYMBOL_OPERATOR
) => {
    const queue = [...theQueue]
    const last = queue.pop()!
    if (!(last in SYMBOL_OPERATOR)) {
        queue.push(last)
    }
    queue.push(operator)
    return queue
}

const backspace = (theQueue: IQueue) => {
    const queue = [...theQueue]
    const last = queue.pop()!
    if (isNumberString(last)) {
        if (last.length > 1) {
            const cuted = last.slice(0, last.length - 1)
            queue.push(cuted === '-' ? '0' : cuted)
        } else {
            last === '0' ? queue.pop() : queue.push('0')
        }
    }
    return queue.length > 0 ? queue : ['0']
}

const clear = (theQueue: IQueue) => {
    const queue = [...theQueue]
    const last = queue.pop()!
    if (isNumberString(last)) {
        if (last !== '0') {
            queue.push('0')
            return queue
        }
    }
    return ['0']
}

const proccesser = (() => {
    const len = OPERATOR.length

    return (queue: IQueue): BigNumberOrigin => {
        for (let i = 0; i < len; i += 1) {
            const operator = OPERATOR[i]
            const index = queue.indexOf(operator)

            if (index === -1) {
                continue
            }

            const left = queue.slice(0, index)
            const right = queue.slice(index + 1, queue.length)
            const leftLen = left.length
            const rightLen = right.length

            if (leftLen && rightLen) {
                // 相当于 left.plus(right)
                return new BigNumber(proccesser(left))[
                    TO_BIGNUMBER_OPERATOR[operator]
                ](proccesser(right))
            } else if (leftLen || rightLen) {
                return proccesser(leftLen > rightLen ? left : right)
            }
        }

        return queue.length > 0 ? new BigNumber(queue[0]) : new BigNumber('0')
    }
})()

const equals = (queue: IQueue) => {
    const result = proccesser(queue).toFixed(2)
    return [new BigNumber(result).toString()]
}

export const useQueue = (
    value: string
): [IQueue, React.MutableRefObject<IQueue>, ISetQueue] => {
    const [queue, setQueueState] = useState<IQueue>([value])
    const queueRef = useRef<IQueue>(queue)
    const lastValue = useRef<string>(queue[0])

    useEffect(() => {
        setQueueState([value])
    }, [value])

    useEffect(() => {
        queueRef.current = queue
    }, [queue])

    const setQueue = useMemo<ISetQueue>(
        () => ({
            addNumber(number) {
                setQueueState(addNumber(queueRef.current, number))
            },
            addOperator(operator) {
                setQueueState(addOperator(queueRef.current, operator))
            },
            backspace() {
                setQueueState(backspace(queueRef.current))
            },
            clear() {
                setQueueState(clear(queueRef.current))
            },
            equals(callback) {
                if (
                    queueRef.current.length > 1 ||
                    queueRef.current[0] !== lastValue.current
                ) {
                    const result = equals(queueRef.current)
                    lastValue.current = result[0]
                    callback && callback(result[0])
                }
            },
            isAllClear() {
                const _queue = [...queueRef.current]
                const last = _queue.pop()!
                return !isNumberString(last)
            }
        }),
        [setQueueState]
    )

    return [queue, queueRef, setQueue]
}
