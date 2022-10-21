import { createContext } from 'react'

export interface CommentContext {
    nested?: boolean
}
export default createContext(<CommentContext>{})
