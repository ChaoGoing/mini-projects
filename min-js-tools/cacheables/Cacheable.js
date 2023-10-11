class CacheAble {
  hits = 0;
  #lastFetch = 0;
  #initialized = false;
  #promise; // 守卫变量
  #value; // 缓存上一次请求的结果

  constructor() {}

  async fetch(resource) {
    this.#lastFetch = Date.now();
    this.#promise = resource();
    this.#value = await this.#promise;
    if (!this.#initialized) this.#initialized = true;
    this.#promise = undefined;
    return this.#value;
  }

  get #isFetching() {
    return !!this.#promise;
  }

  async fetchNoConcurrent(resource) {
    if (this.#isFetching) {
      await this.#promise;
      return this.#value;
    }
    return this.fetch(resource);
  }

  async touch(resouce, options) {
    // 第一次请求，初始化
    if (!this.#initialized) {
      return this.#handlePreInit(resource, options);
    }
    // 没有options参数，默认使用cache-only策略
    if (!options) {
      return this.#handleCacheOnly();
    }
    // 不同请求策略
    switch (options.cachePolicy) {
      case "cache-only":
        return this.#handleCacheOnly();
      // case 'network-only':
      //   return this.#handleNetworkOnly(resource)
      // case 'stale-while-revalidate':
      //   return this.#handleSwr(resource, options.maxAge)
      case "max-age":
        return this.#handleMaxAge(resource, options.maxAge);
      // case 'network-only-non-concurrent':
      //   return this.#handleNetworkOnlyNonConcurrent(resource)
    }
  }

  #handlePreInit() {
    if (!options) return this.fetch(resource);
    return this.fetchNonConcurrent(resource);
  }
  #handleCacheOnly() {
    return this.#value;
  }
  #handleMaxAge() {
    if (Date.now() > this.#lastFetch + maxAge) {
      return this.fetchNonConcurrent(resource);
    }
    return this.#value;
  }
}

const c = new CacheAble();
const options = { cachePolicy: "max-age", maxAge: 5000 };
cacheable.touch(resource, options);
