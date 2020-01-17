import { useStorage } from '@/utils/useStorage'

export default () => {
    const [token, setToken] = useStorage<string | null>('token', null)

    return { token, setToken }
}
