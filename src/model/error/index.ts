import { notification } from './../../components/Notification/index'
import { ApolloError } from 'apollo-boost'

export const onApolloError = (error: ApolloError) => {
    if (error.graphQLErrors.length > 0) {
        error.graphQLErrors.forEach((err) =>{
            const code = err.extensions && err.extensions.code
            notification.error({
                content: err.message
            })
        })
    } else {
        notification.error({
            content: '服务器错误'
        })
    }
}
