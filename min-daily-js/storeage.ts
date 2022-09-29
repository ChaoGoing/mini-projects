type SetParams = {
    key: string
    data: any
    expiredTime?: number // 过期时间戳
    time?: number // (从createTime开始计时)过期时间
}
type StorageData = {
    data: any
    createTime: number
    expiredTime: number
}

interface LocalStorage {
    // 重载
    setWithExpiredTime(
        key: SetParams['key'],
        data: SetParams['data'],
        expiredTime?: SetParams['expiredTime'],
        time?: SetParams['time']
    ): void
    setWithExpiredTime(params: SetParams): void
    getWithExpiredTime(key: string): any
    set(key: string, data: any): void
    get(key: string): any
    delete(key: string): void
}

const defaultTime = 1000 * 60 * 60 * 24 * 7 // 默认设置过期时间：7天

export const LocalStorage: LocalStorage = {
    setWithExpiredTime(
        arg1: SetParams['key'] | SetParams,
        data?: SetParams['data'],
        expiredTime?: SetParams['expiredTime'],
        time?: SetParams['time']
    ) {
        if (typeof arg1 === 'string') {
            const key = arg1
            const storage = {
                data,
                createTime: Date.now(),
                expiredTime: expiredTime || Date.now() + (time || defaultTime)
            }
            this.set(key, storage)
        } else {
            const { key, data, expiredTime, time } = arg1
            const storage = {
                data,
                createTime: Date.now(),
                expiredTime: expiredTime || Date.now() + (time || defaultTime)
            }
            this.set(key, storage)
        }
    },
    getWithExpiredTime(key: string) {
        try {
            const storage: StorageData = this.get(key)
            if (!storage?.createTime) return storage
            const { data, expiredTime } = storage
            if (Date.now() > expiredTime) {
                this.delete(key)
                return
            }
            return data
        } catch (e) {
            return ''
        }
    },
    set(key: string, data: any) {
        try {
            localStorage.setItem(key, JSON.stringify(data))
        } catch (e) {}
    },
    get(key: string) {
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch (e) {
            return ''
        }
    },
    delete(key: string) {
        localStorage.removeItem(key)
    }
}
