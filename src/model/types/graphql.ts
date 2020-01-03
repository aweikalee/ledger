export interface IReport {
    code: string
    message: string
}

export interface ILoginReport extends IReport {
    username: string
    nickname: string
    token: string
}