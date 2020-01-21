import { IStatus } from './status'
import icon from '@/middleware/classify/Icon/map'
import color from '@/middleware/classify/Color/color.module.scss'

export type IIcon = keyof typeof icon
export type IColor = keyof typeof color

export interface IClassify {
    _id?: string
    pid?: string
    text?: string
    icon?: IIcon
    color?: IColor
}

export interface ICreateClassify {
    pid?: string
    text?: string
    icon?: IIcon
    color?: IColor
}

export interface IUpdateClassify {
    _id?: string
    pid?: string
    text?: string
    icon?: IIcon
    color?: IColor
    status?: IStatus
    deleted?: boolean
}
