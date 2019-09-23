export const scrollTo = (element: Element, to: number, duration: number) => {
    if (duration <= 0) {
        requestAnimationFrame(() => {
            element.scrollTop = to
        })
        return
    }
    const difference = to - element.scrollTop
    const perTick = (difference / duration) * 10

    requestAnimationFrame(() => {
        element.scrollTop += perTick
        if (element.scrollTop === to) return
        scrollTo(element, to, duration - 10)
    })
}

export default scrollTo

export const getOffsetScrollTop = (parent: Element, child: Element) => {
    const _parent = parent.getBoundingClientRect()
    const _child = child.getBoundingClientRect()

    return _child.top -_parent.top + parent.scrollTop
}
