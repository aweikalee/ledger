export interface IMeasureFont {
    fontStyle?: 'normal' | 'italic' | 'oblique'
    fontVariant?: 'normal' | 'small-caps'
    fontWeight?:
        | 'normal'
        | 'bold'
        | 'bolder'
        | 'lighter'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900'
    fontSize?: string | number
    fontFamily?: string
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!

let lastFont = ''

export default function(text: string, font?: IMeasureFont) {
    const {
        fontStyle = 'normal',
        fontVariant = 'normal',
        fontWeight = 'normal',
        fontSize = '10px',
        fontFamily = 'serif'
    }: IMeasureFont = font || {}

    /**
     * font: font-style font-variant font-weight font-size/line-height font-family
     * from https://www.w3schools.com/cssref/pr_font_font.asp
     */
    const newFont = [
        fontStyle,
        fontVariant,
        fontWeight,
        fontSize,
        fontFamily
    ].join(' ')

    if (lastFont !== newFont) {
        ctx.font = lastFont = newFont
    }

    return ctx.measureText(text)
}
