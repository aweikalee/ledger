import { IIconProps } from '@/components/Icon/Icon'
import color from '@/style/color.module.scss'

export interface IClassify {
    _id: string
    text: string
    icon: IIconProps['text']
    color: keyof typeof color
}
