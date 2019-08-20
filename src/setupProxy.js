const { ApolloServer, makeExecutableSchema } = require('apollo-server-express')
const typeDefs = require('./graphql/mocks/typeDefs')
const mocks = require('./graphql/mocks')

const schema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: {
        requireResolversForResolveType: false
    }
})

const server = new ApolloServer({ schema, mocks })

module.exports = function(app) {
    server.applyMiddleware({ app, path: '/graphql' })
}
