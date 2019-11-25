import React, { useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import useForm from 'react-hook-form'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import * as Input from '@/components/Input'
import { Button } from '@/components/Button'
import { Grid } from '@/components/Grid'

import { notification } from '@/components/Notification'
import * as valid from '@/utils/valid'
import { useStore } from '@/store'

import { ILoginReport } from '@/types/graphql'

export interface IForm {
    username: string
    password: string
}

export interface IUserLoginRouteProps {
    id: string
}

const UserLogin: React.FC<RouteComponentProps<
    IUserLoginRouteProps
>> = props => {
    const { history } = props

    const store = useStore()

    const pwdRef = useRef<HTMLInputElement>(null)
    const loginRef = useRef<HTMLElement>(null)

    const [forms, setForms] = useState<IForm>(() => ({
        username: store.username,
        password: ''
    }))
    const {
        register,
        setValue,
        triggerValidation,
        handleSubmit,
        errors
    } = useForm<IForm>({
        mode: 'onChange',
        defaultValues: {
            username: forms.username,
            password: forms.password
        }
    })

    const updateForms = (field: keyof IForm, value: IForm[typeof field]) => {
        setValue(field, value)
        setForms(forms => ({
            ...forms,
            [field]: value
        }))
        triggerValidation([{ name: field }])
    }

    React.useEffect(() => {
        register(
            {
                name: 'username'
            },
            {
                validate: value => {
                    return valid.queue<string>([valid.isRequire()], {
                        name: '用户名'
                    })(value)
                }
            }
        )

        register(
            {
                name: 'password'
            },
            {
                validate: value => {
                    return valid.queue<string>([valid.isRequire()], {
                        name: '密码'
                    })(value)
                }
            }
        )
    })

    const [sendLogin] = useMutation<
        {
            login: ILoginReport
        },
        {
            data: IForm
        }
    >(
        gql`
            mutation($data: LoginInput) {
                login(data: $data) {
                    code
                    message
                    username
                    nickname
                    token
                }
            }
        `
    )

    const login = () => {
        sendLogin({
            variables: {
                data: forms
            }
        }).then(({ data }) => {
            if (data && data.login.code === 200) {
                const info = data.login
                store.setUsername(info.username)
                store.setNickname(info.nickname)
                store.setToken(info.token)

                notification.success({
                    content: '登录成功'
                })

                history.push('/')
            } else {
                notification.error({
                    content: '登录失败'
                })
            }
        })
    }

    return (
        <>
            <NavigationBar
                title="登录"
                left={<BackButton onClick={() => history.goBack()} />}
            />
            <ContentBody maxWidth="sm">
                <Grid gap={4}>
                    <Grid sm={12}>
                        <Input.Control error={!!errors.username}>
                            <Input.Input
                                value={forms.username}
                                placeholder="用户名"
                                tabIndex={1}
                                autoFocus
                                onKeyPress={e => {
                                    if (e.key === 'Enter' && pwdRef.current) {
                                        pwdRef.current.focus()
                                    }
                                }}
                                onChange={e =>
                                    updateForms('username', e.target.value)
                                }
                            />
                            <Input.Helper>
                                {errors.username && errors.username.message}
                            </Input.Helper>
                        </Input.Control>
                    </Grid>

                    <Grid sm={12}>
                        <Input.Control error={!!errors.password}>
                            <Input.Input
                                value={forms.password}
                                type="password"
                                placeholder="密码"
                                tabIndex={2}
                                ref={pwdRef}
                                onKeyPress={e => {
                                    if (e.key === 'Enter' && loginRef.current) {
                                        loginRef.current.focus()
                                    }
                                }}
                                onChange={e =>
                                    updateForms('password', e.target.value)
                                }
                            />
                            <Input.Helper>
                                {errors.password && errors.password.message}
                            </Input.Helper>
                        </Input.Control>
                    </Grid>

                    <Grid sm={12}>
                        <Button
                            type="contained"
                            color="primary"
                            size="large"
                            block
                            border="round"
                            tabIndex={3}
                            ref={loginRef}
                            onClick={handleSubmit(login)}
                        >
                            登录
                        </Button>
                    </Grid>

                    <Grid sm={6}>
                        <Button
                            type="contained"
                            color="warn"
                            size="large"
                            block
                            border="round"
                            tabIndex={4}
                            href="/register"
                        >
                            注册
                        </Button>
                    </Grid>

                    <Grid sm={6}>
                        <Button
                            type="contained"
                            color="default"
                            size="large"
                            block
                            border="round"
                            tabIndex={5}
                            href="/forget"
                        >
                            忘记密码
                        </Button>
                    </Grid>
                </Grid>
            </ContentBody>
        </>
    )
}

export default UserLogin
