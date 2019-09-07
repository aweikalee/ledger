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

const currencys = [
    {
        id: '9b09dd40-598f-4b18-ba24-28e9303487b8',
        name: 'CNY',
        cn: '人民币'
    },
    {
        id: 'a42f2a74-beea-327e-efdf-29b7e4d59b51',
        name: 'HKD',
        cn: '港币'
    },
    {
        id: 'f9100d1e-46db-2caa-4b76-9bf07436ad3d',
        name: 'USD',
        cn: '美元'
    },
    {
        id: '3122ec61-853b-40e9-b0a5-e0e396aea88f',
        name: 'JPY',
        cn: '日元'
    }
]

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
        recordTypes: () => recordTypes,
        currency: (obj, { name }) => currencys.find(v => v.name === name),
        currencys: () => currencys
    }),
    Ledger: () => ({
        title: () => Mock.mock('@csentence(2,6)')
    }),
    Record: () => {
        const result = Mock.mock({
            'currency|1': currencys.map(v => v.name),
            'type|1': recordTypes.map(type => type.id),
            timezone: Mock.mock('@boolean(1, 5, true)')
                ? Mock.mock('@integer(-24, 24)') * 30
                : new Date().getTimezoneOffset(),
            datetime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss.SS")')
        })

        result.rate = {
            CNY: 1,
            HKD: 1.1021,
            USD: 0.1406,
            JPY: 15.0286
        }[result.currency]

        return result
    }
}

module.exports = mocks
