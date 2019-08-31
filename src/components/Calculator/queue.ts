import BigNumberOrigin from 'bignumber.js'
import { ICalculatorKeyboardKey as IKey } from './Keyboard'
import { useState, useMemo, useRef, useEffect } from 'react'

export type IQueue = string[]

export interface ISetQueue {
    addNumber(number: IKey['Number']): void
    addOperator(operator: IKey['Operator']): void
    backspace(): void
    clear(): void
    equals(): void
    isAllClear(): boolean
}

const BigNumber = BigNumberOrigin.clone({ EXPONENTIAL_AT: 1e9 })

const OPERATOR: IKey['Operator'][] = [
    'plus',
    'minus',
    'multiplication',
    'division'
]

const TO_BIGNUMBER_OPERATOR: {
    [key in IKey['Operator']]: 'multipliedBy' | 'dividedBy' | 'plus' | 'minus'
} = {
    multiplication: 'multipliedBy',
    division: 'dividedBy',
    plus: 'plus',
    minus: 'minus'
}

const isNumberString = (number: string) => {
    return !/[^0-9.-]/.test(number)
}

const addNumber = (theQueue: IQueue, number: IKey['Number']) => {
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

const addOperator = (theQueue: IQueue, operator: IKey['Operator']) => {
    const queue = [...theQueue]
    const last = queue.pop()!
    if (!OPERATOR.includes(last as IKey['Operator'])) {
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
        if (last === '0') {
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
    initialState: IQueue
): [IQueue, React.MutableRefObject<IQueue>, ISetQueue] => {
    const [queue, setQueueState] = useState<IQueue>(initialState)
    const queueRef = useRef<IQueue>(queue)
    const lastQueue = useRef<IQueue>(queue)

    useEffect(() => {
        queueRef.current = queue
    }, [queue])

    const setQueue: ISetQueue = useMemo(
        () => ({
            addNumber(number: IKey['Number']) {
                setQueueState(addNumber(queueRef.current, number))
            },
            addOperator(operator: IKey['Operator']) {
                setQueueState(addOperator(queueRef.current, operator))
            },
            backspace() {
                setQueueState(backspace(queueRef.current))
            },
            clear() {
                setQueueState(clear(queueRef.current))
            },
            equals() {
                if (queueRef.current !== lastQueue.current) {
                    setQueueState(equals(queueRef.current))
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
