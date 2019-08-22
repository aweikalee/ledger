const { MockList } = require('apollo-server-express')
const Mock = require('mockjs')

const recordTypes = [
    {
        text: '餐饮',
        id: '2c438dca-3814-48be-b42a-0364a91f769b',
        icon: 'fish',
        color: 'orange'
    },
    {
        text: '交通',
        id: '70e1d85b-334e-4e36-b9d6-652eb961bbfd',
        icon: 'car',
        color: 'blue'
    },
    {
        text: '住宿',
        id: 'ef96abd9-6f43-4d52-8aee-41659353ee22',
        icon: 'home',
        color: 'purple'
    }
]
const recordType = () => recordTypes[Mock.mock('@integer(0,2)')]

const mocks = {
    String: () => Mock.mock('@csentence'),
    Query: () => ({
        ledgers: () => new MockList([15, 20]),
        records: () => new MockList([2, 10]),
        recordType: () => recordType(),
        recordTypes: () => recordTypes
    }),
    Ledger: () => ({
        title: () => Mock.mock('@csentence(2,6)')
    }),
    Record: () => {
        return Mock.mock({
            'currency|1': ['CNY', 'USD', 'HKD', 'JPY']
        })
    }
}

module.exports = mocks
