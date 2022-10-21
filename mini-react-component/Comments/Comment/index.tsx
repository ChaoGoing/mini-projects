import React, { useContext } from 'react'
import classNames from 'classnames'
import { Avatar } from '@material-ui/core'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

import ImgFavorite from 'assets/shared/article/fav.png'
import ImgFavoriteOutlined from 'assets/shared/article/fav2.png'
import { Comment } from 'pages/shared/article/type'
import CommentContext from './context'
import styles from './index.module.scss'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export interface CommentHeaderProps extends Omit<Comment, 'content'> {}

export const CommentHeader: React.FC<CommentHeaderProps> = React.memo(({ open_user = {}, praise_num, is_praise }) => {
    const { avatar, sign_num, nickname, show_medal } = open_user
    const { nested } = useContext(CommentContext)

    return (
        <div className={styles.header}>
            <Avatar alt="头像" src={avatar} className={styles.avatar} />
            <div className={styles.info}>
                <div className={styles.top}>
                    <div className={styles.name}>{nickname}</div>
                    {show_medal?.id && <img src={show_medal.thumb} alt="" className={styles.medal} />}
                </div>
                {!nested && <div className={styles.sign}>已签到{sign_num}天</div>}
            </div>

            <div className={styles.actions}>
                <span>回复</span>
                <div className={styles.divider} />
                <span>
                    {is_praise ? (
                        <img src={ImgFavoriteOutlined.src} alt="点赞" />
                    ) : (
                        <img src={ImgFavorite.src} alt="点赞" />
                    )}
                    {praise_num || '点赞'}
                </span>
            </div>
        </div>
    )
})

export interface CommentProps extends Comment {
    className?: string
    children?: React.ReactNode
    childNested?: boolean
    onAction?: () => void
}

const Comment: React.FC<CommentProps> = props => {
    const { children, content, at_nickname, onAction, ...rest } = props
    const { nested } = useContext(CommentContext)
    const renderReplyContent = (c: any) => {
        return (
            <>
                <span className={styles.colorPink}>回复</span>
                <div className={styles.name}>{at_nickname}</div>：{c}
            </>
        )
    }
    const renderNestedChildren = (c: any) => {
        return <div className={styles.nestedWrapper}>{c}</div>
    }

    console.log('rest.open_user', rest.open_user)

    return (
        <div
            className={classNames(styles.container, nested && styles.nested)}
            onClick={e => {
                e.stopPropagation()
                onAction?.()
            }}
        >
            <CommentHeader {...rest} />
            <div className={styles.content}>{nested && at_nickname ? renderReplyContent(content) : content}</div>
            {!nested && (
                <div className={styles.time}>
                    {dayjs(rest.created_at).fromNow()} {rest.open_user?.region}
                </div>
            )}
            <CommentContext.Provider value={{ nested: true }}>{renderNestedChildren(children)}</CommentContext.Provider>
        </div>
    )
}

export default Comment
