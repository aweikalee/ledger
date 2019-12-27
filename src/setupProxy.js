const proxy = require('http-proxy-middleware')
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
    if (process.env.USE_MOCK) {
        server.applyMiddleware({ app, path: '/graphql' })
    } else {
        app.use(
            proxy('/graphql', {
                target: process.env.GRAPHQL_URL
            })
        )
    }
}