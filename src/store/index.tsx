import createUseContext from 'constate'

import ledger from './ledger'
import components from './components'
import user from './user'

export const useStore = createUseContext(() => {
    return {
        ledger: ledger(),
        user: user(),
        ...components()
    }
})
