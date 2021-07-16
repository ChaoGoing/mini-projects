const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

async function getRepoList() {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

async function  getTagList(repo) {
  // 通过github拼接参数可以实现一些的 简单接口 而不用特地搭建服务器
  return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}