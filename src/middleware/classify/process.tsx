import { IClassify } from '@/model/types/classify'

import iconMap from './Icon/map'
import colorMap from './Color/color.module.scss'

/* ======================================== */

export const getColor = (
    color?: IClassify['color']
): Exclude<IClassify['color'], undefined> => {
    if (!color || !colorMap[color]) {
        return 'grey'
    }
    return color
}

/* ======================================== */

export const getIcon = (
    icon?: IClassify['icon']
): Exclude<IClassify['icon'], undefined> => {
    if (!icon || !iconMap[icon]) {
        return 'unknown'
    }
    return icon
}

/* ======================================== */

export const defaultClassify: IClassify = {
    _id: null!,
    text: '未分类',
    icon: getIcon(),
    color: getColor()
}

export const getClassify = (
    id: IClassify['_id'] | null,
    classifies: IClassify[]
) => {
    return classifies.find(v => v._id === id) || defaultClassify
}
