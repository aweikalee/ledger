export type IButtonTypes = 'text' | 'contained' | 'outlined'
export type IButtonColors = 'default' | 'primary' | 'warn' | 'error'
export type IButtonSizes = 'large' | 'medium' | 'small'
export type IButtonBorders = 'round' | 'full' | 'none'

export type IButtonClass = {
    button: string
    block: string
    content: string
} & {
    [index in
        | IButtonTypes
        | IButtonColors
        | IButtonSizes
        | IButtonBorders]: string
}

export type IButtonGroupClass = {
    group: string
}

export default {} as IButtonClass & IButtonGroupClass
