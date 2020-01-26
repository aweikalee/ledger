import { notification } from './../../components/Notification/index'
import { ApolloError } from 'apollo-boost'
import { GraphQLError } from 'graphql'

export type IErrorProcessors = {
    [key: string]: IErrorProcessor
}

export type IErrorProcessor = (
    extensions: Exclude<GraphQLError['extensions'], undefined>,
    processor?: IErrorProcessors
) => void

export const processorServerError: IErrorProcessors = {
    /* from Mongoose.SchemaTypes */
    CastError({ exception }) {
        notification.error({
            content: `${exception.path}不是有效的${exception.kind}`
        })
    },

    /* from Mongoose.Schema.path.validate */
    ValidationError({ exception }) {
        const errors = exception.errors || {}
        for (const path in errors) {
            const error = errors[path]
            notification.error({
                content: error.message
            })
        }
    }
}

export const processorGraphQLError: IErrorProcessors = {
    INTERNAL_SERVER_ERROR(extensions, processor = processorServerError) {
        if (extensions.exception) {
            const name = extensions.exception.name as string | undefined

            if (name && name in processor) {
                processor[name](extensions)
                return
            }
        }

        notification.error({
            content: '服务器错误'
        })
    }
}

const dispenseGraphQLError = (
    err: GraphQLError,
    processor: IErrorProcessors
) => {
    if (err.extensions) {
        const code = err.extensions.code as string | undefined

        if (code && code in processor) {
            processor[code](err.extensions)
            return
        }
    }

    notification.error({
        content: (err.extensions && err.extensions.message) || err.message
    })
}

export const onApolloError = (
    error: ApolloError,
    processor: IErrorProcessors = processorGraphQLError
) => {
    if (error.graphQLErrors.length > 0) {
        error.graphQLErrors.forEach(err => dispenseGraphQLError(err, processor))
    } else {
        notification.error({
            content: '请求服务器失败'
        })
    }
}

export const onApolloServerError = (processors: IErrorProcessors) => {
    return (error: ApolloError) =>
        onApolloError(error, {
            ...processorGraphQLError,
            INTERNAL_SERVER_ERROR(err) {
                processorGraphQLError.INTERNAL_SERVER_ERROR(err, {
                    ...processorServerError,
                    ...processors
                })
            }
        })
}
