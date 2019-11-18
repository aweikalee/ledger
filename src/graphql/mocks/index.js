const { MockList } = require('apollo-server-express')
const Mock = require('mockjs')

const classfies = [
    {
        text: '餐饮',
        id: '2c438dca-3814-48be-b42a-0364a91f769b',
        icon: 'food',
        color: 'yellow'
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
const recordType = () => classfies[Mock.mock('@integer(0,2)')]

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

const members = [
    {
        id: 'de3665c2-dd62-42a6-9139-164e6fd11fcc',
        name: '张三'
    },
    {
        id: '65a4ce58-ffec-4ac6-805f-0a448fa45c23',
        name: '李四'
    },
    {
        id: 'f0f42ce9-85d9-404f-8e3b-99336ba6687e',
        name: '王五'
    },
    {
        id: '1cef23a5-ebe2-439c-88e6-60ca86477c37',
        name: '赵六六六'
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
        classify: () => recordType(),
        classifies: () => classfies,
        currency: (obj, { name }) => currencys.find(v => v.name === name),
        currencys: () => currencys,
        members: (obj, { pid }) => {
            const arr = [...members]
            const output = []
            for (let i = Mock.mock('@integer(1,4)'); i > 0; i -= 1) {
                const index = Mock.mock(`@integer(0,${arr.length - 1})`)
                const member = arr.splice(index, 1)[0]
                output.push(Object.assign({ pid }, member))
            }
            return output
        }
    }),
    Mutation: () => ({
        createRecord: () => ({
            code: 201,
            message: '创建记录成功'
        })
    }),
    Ledger: () => ({
        title: () => Mock.mock('@csentence(2,6)')
    }),
    Record: () => {
        const result = Mock.mock({
            'currency|1': currencys.map(v => v.name),
            type: Mock.mock('@integer(-1, 1)'),
            'classify|1': classfies.map(type => type.id),
            amount: Mock.mock('@integer(0, 99999)'),
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
    },
    Member: () => Mock.mock({ 'array|1': members }).array
}

module.exports = mocks
