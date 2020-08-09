'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {

    NODE_ENV: '"development"',

    // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
    // 将地址改为自己的本地地址
    BASE_API: '"http://localhost:9900"',

    // 阿里云的地域节点信息地址
    OSS_PATH: '"https://qiufeng-edu.oss-cn-beijing.aliyuncs.com"',

    // 默认头像地址
    AVATAR_URL: '"/2020/08/08/007b955ce6564da29bc6e0b10b7d74ae-%E7%9A%AE%E5%8D%A1%E4%B8%983.gif"',

    // 课程分类模板下载地址
    SUB_EXCEL: '"/2020/08/08/EasyExcel.xlsx"'
})
