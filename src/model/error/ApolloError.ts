import { notification } from './../../components/Notification/index'
import { ApolloError } from 'apollo-boost'
import { GraphQLError } from 'graphql'
import history from '../../app/history'

export type IErrorProcessors = {
    [key: string]: IErrorProcessor
}

export type IGraphQLError = Omit<GraphQLError, 'extensions'> & {
    extensions: Exclude<GraphQLError['extensions'], undefined>
}

export type IErrorProcessor = (
    error: IGraphQLError,
    processor?: IErrorProcessors
) => void

export const processorServerError: IErrorProcessors = {
    /* from Mongoose.SchemaTypes */
    CastError({ extensions }) {
        if (extensions) {
            const { exception } = extensions
            notification.error({
                content: `${exception.path}不是有效的${exception.kind}`
            })
        }
    },

    /* from Mongoose.Schema.path.validate */
    ValidationError({ extensions }) {
        const { exception } = extensions
        const errors = (exception && exception.errors) || {}
        for (const path in errors) {
            const error = errors[path]
            notification.error({
                content: error.message
            })
        }
    }
}

export const processorGraphQLError: IErrorProcessors = {
    INTERNAL_SERVER_ERROR(error, processor = processorServerError) {
        const { extensions } = error
        if (extensions && extensions.exception) {
            const name = extensions.exception.name as string | undefined

            if (name && name in processor) {
                processor[name](error)
                return
            }
        }

        notification.error({
            content: '服务器错误'
        })
    },

    /* from GraphQL directives auth */
    UNAUTHENTICATED(error) {
        notification.error({
            content: error.message,
            duration: 0
        })
    },

    /* from utils token */
    INVLID_TOKEN(error) {
        notification.error({
            content: error.message
        })
        history.push('/login')
    }
}

const dispenseGraphQLError = (
    error: GraphQLError,
    processor: IErrorProcessors
) => {
    const { extensions } = error
    if (extensions) {
        const code = extensions.code as string | undefined

        if (code && code in processor) {
            processor[code](error as IGraphQLError)
            return
        }
    }

    notification.error({
        content: (extensions && extensions.message) || error.message
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
