import React, { useState, useEffect } from 'react'

export type IAsyncComponent = <T = {}>(
    loader: () => Promise<any>
) => React.ComponentType<T>

const AsyncComponent: IAsyncComponent = loader => {
    return props => {
        const [Component, setComponent] = useState<React.FC>()
        useEffect(() => {
            loader()
                .then(module => (module.default ? module.default : module))
                .then(res => setComponent(res))
                .catch(err => {
                    throw err
                })
        }, [])

        return Component ? <Component {...props} /> : null
    }
}

export default AsyncComponent
