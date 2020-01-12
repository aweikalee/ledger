import { useStorage } from '@/utils/useStorage'

export default () => {
    const [lastLedger, setLastLedger] = useStorage<string | undefined>(
        'lastLedger',
        undefined
    )

    return { lastLedger, setLastLedger }
}
