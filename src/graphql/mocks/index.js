const { MockList } = require('apollo-server-express')
const Mock = require('mockjs')

const recordTypes = [
    {
        text: '餐饮',
        id: '2c438dca-3814-48be-b42a-0364a91f769b',
        icon: 'food',
        color: 'orange'
    },
    {
        text: '交通',
        id: '70e1d85b-334e-4e36-b9d6-652eb961bbfd',
        icon: 'traffic',
        color: 'blue'
    },
    {
        text: '住宿',
        id: 'ef96abd9-6f43-4d52-8aee-41659353ee22',
        icon: 'lodging',
        color: 'purple'
    }
]
const recordType = () => recordTypes[Mock.mock('@integer(0,2)')]

const mocks = {
    String: () => Mock.mock('@csentence'),
    Query: () => ({
        ledgers: () => new MockList([0, 20]),
        records: (obj, { date, limit = 10 }) => ({
            next: () => {
                if (Mock.mock('@boolean(1, 5, true)')) {
                    return ''
                } else {
                    return Mock.mock('@guid').toLowerCase()
                }
            },
            content: () =>
                new MockList(limit, () => {
                    const base = mocks.Record()
                    base.time = date
                    return base
                })
        }),
        recordType: () => recordType(),
        recordTypes: () => recordTypes
    }),
    Ledger: () => ({
        title: () => Mock.mock('@csentence(2,6)')
    }),
    Record: () => {
        return Mock.mock({
            'currency|1': ['CNY', 'USD', 'HKD', 'JPY'],
            'type|1': recordTypes.map(type => type.id),
            timezone: Mock.mock('@boolean(1, 5, true)')
                ? Mock.mock('@integer(-24, 24)') * 30
                : new Date().getTimezoneOffset(),
            datetime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss.SS")')
        })
    }
}

module.exports = mocks
