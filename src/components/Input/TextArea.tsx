import React, {
    useRef,
    useContext,
    useLayoutEffect,
    useEffect,
    useState,
    CSSProperties,
    useCallback
} from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'
import { InputContext } from './Control'
import useResizeObserver from '../utils/useResizeObserver'
import calculateNodeHeight from './calculateNodeHeight'

export interface ITextAreaAutoSize {
    minRows?: number
    maxRows?: number
}

export interface ITextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    autosize?: boolean | ITextAreaAutoSize
    onUpdate?: (value: string) => void
}
const TextArea = React.forwardRef<HTMLTextAreaElement, ITextAreaProps>(
    (props, ref) => {
        const {
            className: classNameProp,
            children,
            style: styleProp,
            autosize,
            onUpdate,
            onChange: onChangeProp,
            onFocus: onFocusProp,
            onBlur: onBlurProp,
            ...other
        }: typeof props = props

        const context = useContext(InputContext)

        const el = useRef<HTMLTextAreaElement>(null)
        useLayoutEffect(() => {
            if (ref) {
                if ('current' in ref) {
                    ;(ref as any).current = el.current
                } else {
                    ref(el.current)
                }
            }
        }, [el, ref])

        const timer = useRef<number>()
        const [resizing, setResizing] = useState(false)
        const [textareaStyles, setTextareaStyles] = useState<CSSProperties>({})
        const handlerResize = useCallback(() => {
            if (timer.current) {
                cancelAnimationFrame(timer.current)
            }
            timer.current = requestAnimationFrame(() => {
                setResizing(true)
                if (!autosize || !el.current) {
                    return
                }
                const { minRows, maxRows } = autosize as ITextAreaAutoSize
                const styles = calculateNodeHeight(
                    el.current,
                    false,
                    minRows,
                    maxRows
                )
                setTextareaStyles(styles)

                timer.current = requestAnimationFrame(() => {
                    setResizing(false)
                })
            })
        }, [autosize, setResizing])
        useEffect(() => {
            handlerResize()
            return () => {
                if (timer.current) {
                    cancelAnimationFrame(timer.current)
                }
            }
        }, [handlerResize])
        useResizeObserver(el, handlerResize)

        const onChange: React.TextareaHTMLAttributes<
            HTMLTextAreaElement
        >['onChange'] = e => {
            if (onChangeProp) {
                onChangeProp(e)
            }
            if (onUpdate) {
                onUpdate(e.target.value)
            }
            handlerResize()
        }
        const onFocus: React.DOMAttributes<
            HTMLTextAreaElement
        >['onFocus'] = e => {
            context.onFocus()
            if (onFocusProp) {
                onFocusProp(e)
            }
        }
        const onBlur: React.DOMAttributes<
            HTMLTextAreaElement
        >['onBlur'] = e => {
            context.onBlur()
            if (onBlurProp) {
                onBlurProp(e)
            }
        }

        const className = clsx(styles.textarea, classNameProp)
        const bindProps = {
            disabled: context.disabled,
            onChange,
            onFocus,
            onBlur,
            ref: el,
            style: {
                ...styleProp,
                ...textareaStyles,
                ...(resizing ? { oveflow: 'hidden' } : null)
            },
            ...other
        }

        return (
            <div data-role="input-textarea-content" className={className}>
                <textarea data-role="input-textarea" {...bindProps} />
            </div>
        )
    }
)

export default TextArea
