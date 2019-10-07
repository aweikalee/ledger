import React from 'react'
import { RouteChildrenProps } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import NavigationBar, { BackButton } from '@/components/NavigationBar'
import ContentBody from '@/components/ContentBody'
import ToolBar from '@/components/ToolBar'
import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Grid from '@/components/Grid'
import styles from './Index.module.scss'

export interface IMember {
    id: string
    name: string
}

const Member: React.FC = props => {
    const { match, history } = props as RouteChildrenProps<{
        id: string
    }>

    const id = (match && match.params.id) || ''

    const { data } = useQuery<{
        members: IMember[]
    }>(
        gql`
            query($pid: ID!) {
                members(pid: $pid) {
                    id
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

    return (
        <>
            <NavigationBar
                title="成员管理"
                left={<BackButton onClick={() => history.goBack()} />}
                right={
                    <Button type="text" color="primary" size="medium">
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
                                        >
                                            <Icon text="trash" />
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <Button
                                            type="text"
                                            color="primary"
                                            size="large"
                                        >
                                            <Icon text="gear" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                </Grid>
            </ContentBody>
            <ToolBar />
        </>
    )
}

export default Member
