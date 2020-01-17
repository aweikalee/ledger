const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        proxy('/graphql', {
            target: process.env.SERVER_URL
        })
    )

    app.use(
        proxy('/api', {
            target: process.env.SERVER_URL
        })
    )
}
