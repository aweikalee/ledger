const { gql } = require('apollo-server-express')

module.exports = gql`
    type Query {
        ledger(id: ID!): Ledger
        ledgers: [Ledger]
        record(id: ID!): Record
        records(pid: ID!, date: String, cursor: ID, limit: Int): Records
        recordType(id: ID!): RecordType
        recordTypes(pid: ID!): [RecordType]
        currency(name: String!): Currency
        currencys: [Currency]
        user(id: ID!): User
    }

    interface BasePagination {
        next: ID
    }

    type Ledger {
        id: ID!
        title: String!
    }

    type Record {
        id: ID!
        type: ID!
        timezone: Int
        datetime: String
        detail: String
        amount: Float
        currency: String!
        rate: Float
    }

    type Records implements BasePagination {
        next: ID
        content: [Record]
    }

    type RecordType {
        id: ID!
        text: String!
        icon: String!
        color: String!
    }

    type Currency {
        id: ID!
        name: String!
        cn: String!
    }

    type User {
        id: ID!
        username: String!
        nickname: String!
    }
`
