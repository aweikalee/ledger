import { useStorage } from '@/utils/useStorage'

export default () => {
    const [username, setUsername] = useStorage<string>('username', '')
    const [nickanme, setNickname] = useStorage<string>('nickname', '')
    const [token, setToken] = useStorage<string>('token', '')

    return { username, setUsername, nickanme, setNickname, token, setToken }
}
