import createUseContext from 'constate'
import components from './components'

export const useStore = createUseContext(() => {
    return {
        ...components()
    }
})
