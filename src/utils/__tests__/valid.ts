import * as valid from '../valid'

it('getError', () => {
    expect(valid.getError('normal')).toEqual('数据验证错误')
    expect(valid.getError('')).toEqual('数据验证错误')
    expect(valid.getError('maxLength')).toEqual('不能超过个字符')
    expect(
        valid.getError('maxLength', {
            name: '用户名',
            limit: 12
        })
    ).toEqual('用户名不能超过12个字符')
})

it('isRequire', () => {
    expect(valid.isRequire()()).toEqual('不能为空')
    expect(valid.isRequire()('')).toEqual('不能为空')
    expect(valid.isRequire()('1')).toEqual(true)
})

it('maxLength', () => {
    expect(valid.maxLength(4)()).toEqual(true)
    expect(valid.maxLength(4)('')).toEqual(true)
    expect(valid.maxLength(1)('字')).toEqual(true)
    expect(valid.maxLength(4)(1234)).toEqual(true)
    expect(valid.maxLength(4)('12345')).toEqual('不能超过4个字符')
})

it('minLength', () => {
    expect(valid.minLength(0)()).toEqual(true)
    expect(valid.minLength(0)('')).toEqual(true)
    expect(valid.minLength(1)('字')).toEqual(true)
    expect(valid.maxLength(4)(1234)).toEqual(true)
    expect(valid.minLength(4)('123')).toEqual('不能少于4个字符')
})

it('queue', () => {
    expect(valid.queue([])).toEqual(true)
    expect(valid.queue([valid.isRequire()])('')).toEqual('不能为空')
    expect(valid.queue([valid.isRequire()])('123')).toEqual(true)

    expect(
        valid.queue([valid.isRequire()], {
            name: '用户名'
        })('')
    ).toEqual('用户名不能为空')

    expect(
        valid.queue(
            [
                (value, { name }) => {
                    if (value === 'admin') {
                        return `${name}不能使用admin`
                    }
                    return true
                }
            ],
            {
                name: '用户名'
            }
        )('admin')
    ).toEqual('用户名不能使用admin')
})
