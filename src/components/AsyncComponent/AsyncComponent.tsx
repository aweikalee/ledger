import React from 'react'

const asyncComponent = <T extends {}>(loader: () => Promise<any>) =>
    class AsyncComponent extends React.Component<
        T,
        {
            Component: React.ComponentType<T> | null
        }
    > {
        constructor(props: T) {
            super(props)

            this.state = {
                Component: null
            }
        }
        componentDidMount() {
            loader()
                .then(module => {
                    this.setState({
                        Component: module.default
                    })
                })
                .catch(error => {
                    throw error
                })
        }
        render() {
            const { Component } = this.state
            return Component ? <Component {...this.props} /> : null
        }
    }

export default asyncComponent
