export const getScrollBarWidth = (() => {
    let width: number
    const getWidth = () => {
        const one = document.createElement('div')
        const two = document.createElement('div')
        one.style.overflowY = 'scroll'
        one.style.width = '100px'
        one.style.height = '100px'
        two.style.width = '100px'
        two.style.height = '100px'
        document.body.appendChild(one)
        document.body.appendChild(two)
        width = two.clientWidth - one.clientWidth
        document.body.removeChild(one)
        document.body.removeChild(two)
        return width
    }

    return () => {
        return width === undefined ? getWidth() : width
    }
})()

export const hasScrollBar = (
    element: HTMLElement,
    direction: 'vertical' | 'horizontal' = 'vertical'
) => {
    if (direction === 'vertical') {
        return element.scrollHeight > element.clientHeight
    } else {
        return element.scrollWidth > element.clientWidth
    }
}

export const hasScrollBarWidthDocumnet = (
    direction: 'vertical' | 'horizontal' = 'vertical'
) => {
    if (direction === 'vertical') {
        return (
            document.body.scrollHeight >
            (window.innerHeight || document.documentElement.clientHeight)
        )
    } else {
        return (
            document.body.scrollWidth >
            (window.innerWidth || document.documentElement.clientWidth)
        )
    }
}
