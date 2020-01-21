import Icon from '../Icon'

import * as amount from '@/utils/amount'

export const SYMBOL_OPERATOR = {
    '+': Icon({ text: 'plus' }),
    '-': Icon({ text: 'minus' }),
    '*': Icon({ text: 'mutiplication' }),
    '/': Icon({ text: 'division' })
}

export const SYMBOL_NUMBER = {
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '0': '0',
    '.': '.'
}

export const SYMBOL = {
    backspace: Icon({ text: 'backspace' }),
    reset: 'C',
    '=': Icon({ text: 'equals' }),
    ...SYMBOL_OPERATOR,
    ...SYMBOL_NUMBER
}

export const FORMAT_OPTIONS: amount.IOptions = {
    fractionGroupSize: 3
}
