import createUseContext from 'constate'
import main from './main'
import components from './components'
import user from './user'

export const useStore = createUseContext(() => {
    return {
        ...main(),
        ...components(),
        ...user()
    }
})
