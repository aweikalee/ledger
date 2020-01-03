/* ========== Error Message ========== */

const ERROR_MESSAGE: {
    [key: string]: string
} = {
    normal: '数据验证错误',
    require: '{name}不能为空',
    maxLength: '{name}不能超过{limit}个字符',
    minLength: '{name}不能少于{limit}个字符',
    isDate: '{name}不是有效的日期格式'
}

export type IGetError = (
    template: string,
    fields: {
        [key: string]: string | number | undefined
    }
) => string

export const errorFactory: IGetError = (template, fields = {}) => {
    return (Object.keys(fields).reduce((prev, key) => {
        return prev.replace(
            `{${key}}`,
            fields[key] !== void 0 ? `${fields[key]}` : ''
        )
    }, template || ERROR_MESSAGE['normal']) as string).replace(/\{\w+\}/g, '')
}

export const getError: IGetError = (type, fields = {}) => {
    const template = type in ERROR_MESSAGE ? ERROR_MESSAGE[type] : ''
    return errorFactory(template, fields)
}

/* ========== Rules ========== */

export interface IOptions {
    [key: string]: string | number | undefined
    name?: string
}

export type IRule<T = string | number> = (
    value?: T,
    options?: IOptions
) => boolean | string

export const isRequire = (): IRule => {
    return (value, options = {}) => {
        if (value !== undefined && `${value}`) {
            return true
        }
        return getError('require', options)
    }
}

export const maxLength = (max: number): IRule => {
    return (value, options = {}) => {
        if (`${value || ''}`.length <= max) {
            return true
        }
        return getError('maxLength', {
            ...options,
            limit: max
        })
    }
}

export const minLength = (min: number): IRule => {
    return (value, options = {}) => {
        if (`${value || ''}`.length >= min) {
            return true
        }
        return getError('minLength', {
            ...options,
            limit: min
        })
    }
}

export const isDate = (): IRule<string | number | Date> => {
    return (value, options = {}) => {
        if (!isNaN(new Date(value!).valueOf())) {
            return true
        }
        return getError('isDate', {
            ...options
        })
    }
}

export const isDateString = (): IRule<string> => {
    return (value, options = {}) => {
        if (typeof value === 'string' && !isNaN(new Date(value!).valueOf())) {
            return true
        }
        return getError('isDate', {
            ...options
        })
    }
}

/* ========== queue ========== */

export const queue = <T = string | number>(
    rules: IRule<T>[],
    options: IOptions = {}
) => {
    return (value?: T): boolean | string => {
        for (let i = 0, len = rules.length; i < len; i += 1) {
            const rule = rules[i]
            const result = rule(value, options)
            if (result !== true) {
                return result
            }
        }
        return true
    }
}
