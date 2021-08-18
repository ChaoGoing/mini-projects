### mini-axios

#### 基本使用方法
引入
```
// cjs
const axios = require('axios').default
```


请求
```
axios.get(url, data).then(res => {}).finally(()=>{})

axios({
  method: 'get',
  url,
  data,
}).then(res => {})
```

拦截器
```
axios.interceptor.request.use(function(config){

  return config
})
```

撤销请求cancellation
```

```

常用写法实例
```
const instance = axios.create({
  baseURL: `//${__API_SERVICE_HOST__}`,
  headers: {
    'User-Agent': 'h5'
  }
})

instance.interceptors.request.use(config => {
  // 请求时带上token
  config.headers['Authorization'] = authGetter()
  return config
},
error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(
  response => {
    // do somnething
  },
  error => {
    if(error?.response?.status === 401){
      // 清除token
      clearToken()
    }else {
      toast.warning()
    }
    return Promise.reject()
  }
)

```


### 源码解析

axios.js
```javascript

``` 



