import createUseContext from 'constate'
import components from './components'
import user from './user'

export const useStore = createUseContext(() => {
    return {
        ...components(),
        ...user()
    }
})
