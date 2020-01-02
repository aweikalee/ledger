import React, { useState, useRef, useEffect } from 'react'
import useForm from 'react-hook-form'
import { RouteComponentProps } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Grid from '@/components/Grid'
import Dialog from '@/components/Dialog'
import * as Input from '@/components/Input'
import * as valid from '@/utils/valid'
import styles from './Index.module.scss'

export interface IMember {
    id: string
    name: string
}

export interface IForm {
    id?: string
    name?: string
}

export interface IMemberRouteProps {
    id: string
}

const Member: React.FC<RouteComponentProps<IMemberRouteProps>> = props => {
    const {
        history,
        match: {
            params: { id }
        }
    } = props

    const { data } = useQuery<{
        members: IMember[]
    }>(
        gql`
            query($pid: ID!) {
                members(pid: $pid) {
                    _id
                    name
                }
            }
        `,
        {
            variables: {
                pid: id
            }
        }
    )

    const [showAddDialog, setShowAddDialog] = useState(false)
    const isAdd = useRef(true)

    const [forms, setForms] = useState<IForm>(() => ({
        id: '',
        name: ''
    }))
    const { register, setValue, handleSubmit, errors } = useForm<IForm>({
        mode: 'onChange',
        defaultValues: {
            id: forms.id,
            name: forms.name
        }
    })

    const updateForms = (field: keyof IForm, value: IForm[typeof field]) => {
        setValue(field, value)
        setForms(forms => ({
            ...forms,
            [field]: value
        }))
    }

    useEffect(() => {
        register(
            {
                name: 'name'
            },
            {
                validate: value => {
                    return valid.queue<string>(
                        [valid.minLength(1), valid.maxLength(12)],
                        {
                            name: '名字'
                        }
                    )(value)
                }
            }
        )
    })
    const addConfirm = () => {
        // 提交
        if (isAdd) {
        } else {
        }

        setShowAddDialog(false)
    }

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const deleteData = useRef<IMember>({
        id: '',
        name: ''
    })

    return (
        <>
            <NavigationBar
                title="成员管理"
                left={<BackButton onClick={() => history.goBack()} />}
                right={
                    <Button
                        type="text"
                        color="primary"
                        size="medium"
                        onClick={() => {
                            isAdd.current = true
                            updateForms('id', '')
                            updateForms('name', '')
                            setShowAddDialog(true)
                        }}
                    >
                        添加
                    </Button>
                }
            />
            <ContentBody maxWidth="sm">
                <Grid container gap={2}>
                    {data &&
                        data.members &&
                        data.members.map(item => (
                            <Grid sm={12} key={item.id}>
                                <Grid
                                    sm={12}
                                    className={styles.item}
                                    alignItems="center"
                                >
                                    <Grid sm>
                                        <div className={styles.name}>
                                            {item.name}
                                        </div>
                                    </Grid>
                                    <Grid>
                                        <Button
                                            type="text"
                                            color="default"
                                            size="large"
                                            onClick={() => {
                                                deleteData.current = item
                                                setShowDeleteDialog(true)
                                            }}
                                        >
                                            <Icon text="trash" />
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <Button
                                            type="text"
                                            color="primary"
                                            size="large"
                                            onClick={() => {
                                                updateForms('id', item.id)
                                                updateForms('name', item.name)
                                                isAdd.current = false
                                                setShowAddDialog(true)
                                            }}
                                        >
                                            <Icon text="gear" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                </Grid>

                {/* 添加 */}
                <Dialog
                    show={showAddDialog}
                    title={isAdd.current ? '添加成员' : '编辑成员'}
                    onConfirm={handleSubmit(addConfirm)}
                    onClose={() => setShowAddDialog(false)}
                >
                    <Input.Control error={!!errors.name}>
                        <Input.Input
                            name="name"
                            placeholder="名字"
                            value={forms.name}
                            onChange={e => updateForms('name', e.target.value)}
                            autoFocus
                        ></Input.Input>
                        <Input.Helper>
                            {errors.name && errors.name.message}
                        </Input.Helper>
                    </Input.Control>
                </Dialog>

                {/* 删除确认 */}
                <Dialog
                    show={showDeleteDialog}
                    onConfirm={() => setShowDeleteDialog(false)}
                    onClose={() => setShowDeleteDialog(false)}
                >
                    确定要删除 “{deleteData.current.name}” 吗？
                </Dialog>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default Member
