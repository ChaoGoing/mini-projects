import React, { useRef, useEffect, useState, useMemo } from 'react'
import request from '@utils/request'
import { NoticeItem } from '@views/farm/main/interface'
// import styles from './index.module.scss'

export const NoticeItemComp = ({ data }: { data: NoticeItem }) => {
    return (
        <div className={styles.item}>
            {data.avatar && <img src={data.avatar} className={styles.avatar} />}
            <div className={styles.name}>{data.user_name}</div>
            <div>{data.content}</div>
        </div>
    )
}

const NoticeBar = () => {
    const [list, setList] = useState<NoticeItem[]>([])

    const displayIdxRef = useRef(0)
    const timer = useRef<any>()
    const [displayIdx, setDisplayIdx] = useState(0)

    useEffect(() => {
        ~(async function () {
            const { data } = await request.get<{ list: NoticeItem[] }>('manor/user/encourage/list')
            setList((data.list || []).filter(n => n.user_name))
        })()
    }, [])
    const stack = useMemo(() => [...list, list[0]], [list])

    const slide = (timeout = 3000) => {
        timer.current = setTimeout(() => {
            clearTimeout(timer.current)
            if (displayIdxRef.current < stack.length - 1) {
                displayIdxRef.current++
                setDisplayIdx(displayIdxRef.current)
                return slide()
            } else {
                displayIdxRef.current = 0
                setDisplayIdx(displayIdxRef.current)
                slide(100)
            }
        }, timeout)
    }

    useEffect(() => {
        if (!stack.length) return
        slide()
        return () => {
            clearTimeout(timer.current)
            timer.current = null
        }
    }, [stack])

    return list?.length ? (
        <div className={styles.bar}>
            <div
                className={styles.list}
                style={{
                    transform: `translateY(-${displayIdx * 0.53}rem)`,
                    transition: displayIdxRef.current === 0 ? 'none' : 'all 1s ease'
                }}
            >
                {stack.map((notice, i) => (
                    <NoticeItemComp key={i} data={notice} />
                ))}
            </div>
        </div>
    ) : null
}

export default NoticeBar
