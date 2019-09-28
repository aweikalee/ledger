import React from 'react'

export type ItemRenderer = (
    index: number,
    key: number | string
) => React.ReactNode
export type ItemsRenderer = (
    items: JSX.Element[],
    ref: string
) => React.ReactNode
export type ItemSizeEstimator = (index: number, cache: {}) => number
export type ItemSizeGetter = (index: number) => number
export type ScrollParentGetter = (component: ReactList) => HTMLElement | window

export interface ReactListProps extends React.Props<ReactList> {
    axis?: 'x' | 'y'
    initialIndex?: number
    itemRenderer?: ItemRenderer
    itemSizeEstimator?: ItemSizeEstimator
    itemSizeGetter?: ItemSizeGetter
    itemsRenderer?: ItemsRenderer
    length?: number
    minSize?: number
    pageSize?: number
    scrollParentGetter?: ScrollParentGetter
    threshold?: number
    type?: 'simple' | 'variable' | 'uniform'
    useStaticSize?: boolean
    useTranslate3d?: boolean
}

declare class ReactList extends React.Component<ReactListProps> {
    el: HTMLElement
    items: HTMLElement
    scrollTo(index: number): void
    scrollAround(index: number): void
    getVisibleRange(): number[]
    getEl(): HTMLElement
    getSizeOfItem(index: number): number
    getSpaceBefore(index: number): number
}
declare namespace ReactList {}
export = ReactList
