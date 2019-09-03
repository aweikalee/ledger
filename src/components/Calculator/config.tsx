import * as amount from '@/utils/amount'

export const SYMBOL_OPERATOR = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷'
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
    backspace: '<=',
    reset: 'C',
    '=': '=',
    ...SYMBOL_OPERATOR,
    ...SYMBOL_NUMBER
}

export const FORMAT_OPTIONS: amount.IOptions = {
    fractionGroupSize: 3
}
