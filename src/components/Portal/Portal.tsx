import React from 'react'
import ReactDOM from 'react-dom'

export interface IPortalProps {
    container: 'modal'
}

const CONTAINER: {
    [key in IPortalProps['container']]: HTMLElement
} = {
    modal: document.getElementById('modal-root')!
}

const Portal: React.FC<IPortalProps> = props => {
    return ReactDOM.createPortal(props.children, CONTAINER[props.container])
}

export default Portal
