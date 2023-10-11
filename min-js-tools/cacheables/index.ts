//region Types
export type CacheOptions = {
  /**
   * Enables caching
   */
  enabled?: boolean;
  /**
   * Enable/disable logging of cache hits
   */
  log?: boolean;
  /**
   * Enable/disable timings
   */
  logTiming?: boolean;
};

class Cacheables {
  enabled: boolean;
  log: boolean;
  logTiming: boolean;

  constructor(options?: CacheOptions) {
    this.enabled = options?.enabled ?? true;
    this.log = options?.log ?? false;
    this.logTiming = options?.logTiming ?? false;
  }
  // 使用提供的参数创建一个 key
  static key(): string {}

  // 删除一笔缓存
  delete(): void {}

  // 清除所有缓存
  clear(): void {}

  // 返回指定 key 的缓存对象是否存在，并且有效（即是否超时）
  isCached(key: string): boolean {}

  // 返回所有的缓存 key
  keys(): string[] {}

  // 用来包装方法调用，做缓存
  async cacheable<T>(): Promise<T> {}
}
