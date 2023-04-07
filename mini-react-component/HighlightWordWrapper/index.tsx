import React, { useRef, PropsWithChildren, useEffect, useState } from 'react'
import classNames from 'classnames'

import styles from './index.module.scss'

export interface DetectionWrodWrapperProps {
    highlightKeys: string[]
    backdropClassName?: string // 文本框同步样式
    overlayStyle?: Record<string, any>
}
const HighlightWordWrapper: React.FC<PropsWithChildren<DetectionWrodWrapperProps>> = ({
    children,
    highlightKeys = [],
    backdropClassName,
    overlayStyle = {} // 可用于覆盖backdropClassName下的样式
}) => {
    const containerRef = useRef<HTMLDivElement>()
    const backdropRef = useRef<HTMLDivElement>()
    const highlightsRef = useRef<HTMLDivElement>()
    const [childInputVal, setChildInputVal] = useState('')
    const [childInputClassName, setChildInputClassName] = useState('')
    const [childOverFlow, setChildOverFlow] = useState('unset') // 由于子元素的overflow不一定是在传入的类名中定义，需要在初始化中获得

    const highlight = str => {
        if (!str) return ''
        for (var i = 0; i < highlightKeys.length; i++) {
            var pattern = new RegExp(highlightKeys[i], 'g')
            str = str.replace(pattern, `<mark>` + highlightKeys[i] + '</mark>') || ''
        }
        return str
    }

    const getDecoratedChildren = () => {
        return React.Children.map(children, child => {
            return React.cloneElement(child as any, {
                // 有需要时可以向子元素传递参数
            })
        })
    }

    useEffect(() => {
        setTimeout(() => {
            const maxLength = (children as React.ReactElement)?.props?.maxLength
            // childInput类型：textarea | input | 设置了contentEditable的div
            const childInput =
                containerRef.current.querySelector('textarea') ||
                containerRef.current.querySelector('input') ||
                containerRef.current.querySelector('div[contentEditable]')
            if (!childInput) {
                console.error('无有效的childInput， 请检查highlightWrapper下是否包含有效的输入框元素')
                return
            }

            const inputVal = childInput.value || childInput.innerText
            setChildInputVal(inputVal)
            setChildInputClassName(childInput.className)
            setChildOverFlow(getComputedStyle(childInput).overflow)

            if (!highlightKeys?.length) {
                highlightsRef.current.innerHTML = ''
                setTimeout(() => {
                    backdropRef.current.style.height = childInput.offsetHeight + 'px'
                }, 50)

                return
            }
            const formatHtml = highlight(inputVal)
            highlightsRef.current.innerHTML = formatHtml
            setTimeout(() => {
                backdropRef.current.style.height = childInput.offsetHeight + 'px'
            }, 50)

            if (childInput['contentEditable']) {
                childInput.addEventListener('input', (e: any) => {
                    const _val = e.target.innerText || e.target.value
                    const formatHtml = highlight(maxLength ? _val.slice(0, maxLength) : _val)
                    highlightsRef.current.innerHTML = formatHtml
                    setTimeout(() => {
                        backdropRef.current.style.height = childInput.offsetHeight + 'px'
                    }, 50)
                })
            }

            // 有滚动条时
            childInput.addEventListener('scroll', () => {
                backdropRef.current.scrollTo({ top: childInput.scrollTop })
            })
            backdropRef.current.scrollTo({ top: childInput.scrollTop })
        }, 200)
    }, [highlightKeys])

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                className={classNames(childInputClassName, backdropClassName, styles.backdrop)}
                ref={backdropRef}
                style={{ ...overlayStyle, overflow: childOverFlow } || { overflow: childOverFlow }}
            >
                <div className={classNames(styles.highlights)} ref={highlightsRef} />
            </div>
            {getDecoratedChildren()}
        </div>
    )
}

export default HighlightWordWrapper
