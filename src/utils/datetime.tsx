const MONTH_LAST_DAY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

interface IGetMonthLastDay {
    (date: Date): number
    (year: number, month: number): number
}

export const getMonthLastDay: IGetMonthLastDay = (var1: any, var2?: number) => {
    let year: number
    let month: number
    if (var1 instanceof Date) {
        year = var1.getFullYear()
        month = var1.getMonth() + 1
    } else {
        year = var1
        month = var2 as number
    }

    if (month === 2) {
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            return 29
        } else {
            return 28
        }
    } else {
        return MONTH_LAST_DAY[month - 1]
    }
}
