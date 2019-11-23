import React from 'react'
import Button from '@/components/Button'
import Dialog from '@/components/Dialog'
// import * as Select from '@/components/Select'
// import * as Menu from '@/components/Menu'
// import * as DatePicker from '@/components/DatePicker'
// import ReactList from 'react-list'
// import { ISelectDrawerProps } from '@/components/Select/Drawer'
// import { ISelectColumnProps } from '@/components/Select/Column'
// import scrollTo, { getOffsetScrollTop } from '@/components/utils/scrollTo'

const Test: React.FC = props => {
    // const [value, setValue] = useState<ISelectColumnProps['value'][]>([0, [0]])
    // const list: number[] = []
    // for (let i = 0; i < 100; i += 1) {
    //     list.push(i)
    // }

    // const ref = useRef<HTMLElement>(null)
    // const [showCurrency, setShowCurrency] = useState(false)
    // const [showCurrency1, setShowCurrency1] = useState(true)

    // const scroll = () => {}

    // const [dd,setDD] = useState(() => new Date())
    const [show, setShow] = React.useState(false)

    return (
        <>
            <Button onClick={() => setShow(true)}>123123</Button>

            <Dialog show={show} title="asdasd222222222222222222222222222222as" onClose={() => setShow(false)}>
                12313asdasd
            </Dialog>
        </>
    )
}

export default Test
