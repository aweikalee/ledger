export const format = (
    amount: string,
    options: {
        groupSize?: number
        groupSeparator?: string
        fractionGroupSize?: number
        fractionGroupSeparator?: string
        decimalSeparator?: string
        prefix?: string
        suffix?: string
    } = {}
) => {
    const {
        groupSize,
        groupSeparator,
        fractionGroupSize,
        fractionGroupSeparator,
        decimalSeparator,
        prefix,
        suffix
    } = Object.assign(
        {
            groupSize: 3,
            groupSeparator: ',',
            fractionGroupSize: 0,
            fractionGroupSeparator: ' ',
            decimalSeparator: '.',
            prefix: '',
            suffix: ''
        },
        options
    )

    const arr = amount.split('.')
    const int = arr[0]
    const fraction = arr[1] || ''
    const intLen = int.length
    const fractionLen = fraction.length
    let result = ''
    let i

    if (intLen > 0) {
        if ( groupSize > 0 && groupSeparator !== '') {
            i = intLen % groupSize || groupSize
            result += int.substr(0, i)
            for (; i < intLen; i += groupSize) {
                result += groupSeparator + int.substr(i, groupSize)
            }
        } else {
            result += int
        }
    }

    if (arr.length === 2) {
        result += decimalSeparator
    }

    if (fraction.length > 0) {
        if (fractionGroupSize > 0 && fractionGroupSeparator !== '') {
            i = fractionGroupSize
            result += fraction.substr(0, i)
            for (; i < fractionLen; i += fractionGroupSize) {
                result += fractionGroupSeparator + fraction.substr(i, fractionGroupSize)
            }
        } else {
            result += fraction
        }
    }

    return `${prefix}${result}${suffix}`
}
