const { gql } = require('apollo-server-express')

module.exports = gql`
    type Query {
        ledger(id: ID!): Ledger
        ledgers: [Ledger]
        record(id: ID!): Record
        records(pid: ID!, date: String, cursor: ID, limit: Int): Records
        classify(id: ID!): Classify
        classifies(pid: ID!): [Classify]
        currency(name: String!): Currency
        currencys: [Currency]
        member(id: ID!): Member
        members(pid: ID!): [Member]
        user(id: ID!): User
    }

    type Mutation {
        createRecord(data: RecordInput): Report
        login(data: LoginInput): LoginReport
    }

    interface BasePagination {
        next: ID
    }

    type Ledger {
        id: ID!
        title: String!
    }

    type Record {
        id: ID
        type: Int
        classify: ID
        timezone: Int
        datetime: String
        detail: String
        amount: String
        currency: String
        rate: Float # 暂时不实现 rate
        payer: [ID]
        participator: [ID]
        settled: [ID]
    }

    input RecordInput {
        id: ID
        type: Int
        classify: ID
        timezone: Int
        datetime: String
        detail: String
        amount: String
        currency: String
        rate: Float # 暂时不实现 rate
        payer: [ID]
        participator: [ID]
        settled: [ID]
    }

    type Records implements BasePagination {
        next: ID
        content: [Record]
    }

    type Classify {
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

    type Member {
        id: ID!
        name: String!
        pid: ID!
    }

    type User {
        id: ID!
        username: String!
        nickname: String!
    }

    interface Report {
        code: Int
        message: String
    }

    input LoginInput {
        username: String
        password: String
    }

    type LoginReport implements Report {
        code: Int
        message: String
        username: String
        nickname: String
    }
`
