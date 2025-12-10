import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import scrollListener from '../utils/scrollListener'

interface IProps {
    height: number
    children: any
    style?: React.CSSProperties
}
const wh = document.documentElement.clientHeight || document.body.clientHeight

const ScrollWrap: React.FC<IProps> = ({ children, height = document.body.offsetHeight, style = {} }) => {
    const elRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

    const [process, setProcess] = useState(0)
    const [visible, setVisible] = useState(false)
    const relatveRef = useRef(true)
    useEffect(() => {
        if (!elRef.current) return
        const offsetTop = elRef.current?.offsetTop || 0
        const state = {
            startIndex: offsetTop,
            endIndex: offsetTop + height
        }
        console.log("s", state)
        const handler = (scroll: number) => {
            console.log('scroll: ', scroll);
            if (scroll >= state.startIndex && scroll <= state.endIndex) {
                const process = Number(((scroll - state.startIndex) / (state.endIndex - state.startIndex)).toFixed(2))
                setProcess(process)
                setVisible(true)
                if (!relatveRef.current) return
                relatveRef.current = false
                elRef.current!.style.top = '0px'
                elRef.current!.style.position = 'sticky'
            } else if (scroll > state.endIndex) {
                setProcess(1)
                setVisible(false)
                if (relatveRef.current) return
                relatveRef.current = true
                elRef.current!.style.position = 'relative'
                elRef.current!.style.top = bodyRef.current!.offsetHeight + 'px'
            }
        }
        const remove = scrollListener('#scroll-wrap-container', handler)
        handler(0)
        return remove
    }, [elRef])

    return (
        <div>
            <div className={styles.box} ref={elRef} style={{ height: wh + 'px', ...style }}>
                {typeof children === 'function' ? children(process, visible) : children}
            </div>
            <div ref={bodyRef} style={{ height: height + 'px' }}></div>
        </div>
    )
}

export default ScrollWrap
