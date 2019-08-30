import { format } from '../amount'

it('timeZoneNameToUTC', () => {
    expect(format('00000123')).toEqual('00,000,123')

    expect(
        format('0.1234120000', {
            fractionGroupSize: 4
        })
    ).toEqual('0.1234 1200 00')

    expect(
        format('123.456', {
            prefix: '$',
            suffix: '#'
        })
    ).toEqual('$123.456#')

    expect(format('123.')).toEqual('123.')

    expect(format('.123')).toEqual('.123')

    expect(
        format('12121.12121', {
            groupSize: 2,
            groupSeparator: '.',
            fractionGroupSize: 2,
            fractionGroupSeparator: ',',
            decimalSeparator: '-'
        })
    ).toEqual('1.21.21-12,12,1')
})
