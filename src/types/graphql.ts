export interface IReport {
    code: number
    message: string
}

export interface ILoginReport extends IReport {
    username: string
    nickname: string
}
