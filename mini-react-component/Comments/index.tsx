import React from 'react'
import { ArrowForwardIos } from '@material-ui/icons'

import { IComment } from 'pages/shared/article/type'
import Comment from '../Comment'
import styles from './index.module.scss'

interface Iprops {
    data: IComment
    gotoAppDownload: () => Promise<void>
}

const Comments: React.FC<Iprops> = ({ data: propsData, gotoAppDownload }) => {
    const { data, total } = propsData

    return (
        <div className={styles.comments}>
            <div className={styles.total}>共{total}条评论</div>
            {data?.length
                ? data.map(_comment => {
                      const showMore = _comment?.comment_num > _comment.comment?.length
                      return (
                          <Comment {..._comment} key={_comment.id} onAction={gotoAppDownload}>
                              {_comment.comment.map(_replyComment => (
                                  <Comment {..._replyComment} key={_replyComment.id} onAction={gotoAppDownload} />
                              ))}
                              {showMore && (
                                  <div className={styles.showMore} key="more">
                                      <span>查看{_comment.comment_num}条回复</span>
                                      <ArrowForwardIos />
                                  </div>
                              )}
                          </Comment>
                      )
                  })
                : null}
        </div>
    )
}

export default Comments
