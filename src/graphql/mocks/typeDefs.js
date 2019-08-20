const { gql } = require('apollo-server-express')

module.exports = gql`
    type Query {
        ledger(id: ID!): Ledger
        ledgers: [Ledger]
        record(id: ID!): Record
        records(pid: ID!): [Record]
        recordType(id: ID!): RecordType
        recordTypes(pid: ID!): [RecordType]
        user(id: ID!): User
    }

    type Ledger {
        id: ID!
        title: String!
    }

    type Record {
        id: ID!
        type: ID!
        detail: String
        amount: Float
        currency: String!
    }

    type RecordType {
        id: ID!
        text: String!
        icon: String!
        color: String!
    }

    type User {
        id: ID!
        username: String!
        nickname: String!
    }
`
