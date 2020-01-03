import { IStatus } from './status'
import { IIconProps } from '@/components/Icon/Icon'
import color from '@/style/color.module.scss'

export interface IClassify {
    _id?: string
    pid?: string
    text?: string
    icon?: IIconProps['text']
    color?: keyof typeof color
}

export interface ICreateClassify {
    pid?: string
    text?: string
    icon?: IIconProps['text']
    color?: keyof typeof color
}

export interface IUpdateClassify {
    _id?: string
    pid?: string
    text?: string
    icon?: IIconProps['text']
    color?: keyof typeof color
    status?: IStatus
    deleted?: boolean
}
