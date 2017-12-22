## node.js 7天开发微信公众号

> 本仓库记录、整理慕课网Scott老师 7天搞定Node.js微信公众号 课程的源码、注释以及一些注意事项（填坑）
课程地址： https://coding.imooc.com/class/38.html  课程非常不错，推荐大家购买 ，购买前建议先对node有一定的了解和看一下慕课网Scott老师的进击Node.js基础（一）、（二）。

### 由于Scott老师的课程历经时间风蚀，会出现一些小 "坑！"

> 当遇到坑的地方可以看看对应的day 有没有提到

## 目录结构介绍

```js
|--- mkWachatExample
    |--- day1  // 第一天
        |--- app.js  // 入口文件
        |--- package.json
        |--- README.md
    |--- day2
        |--- config
            |--- wechat.text  // 保存票据
        |--- libs
            |--- util.js  // 读写操作文件
        |--- wechat
            |--- g  // Generator
            |--- util.js  // 解析、格式化XML文件
            |--- wechat.js  // 处理微信交互文件
        |--- app.js  // 入口文件
        |--- package.json
        |--- README.md
    |--- day4
        |--- config
            |--- wechat.text  // 保存票据
        |--- libs
            |--- util.js  // 读写操作文件
        |--- wechat
            |--- interaction // 与微信互动功能
                |--- accessToken.js // 获取accessToken
                |--- material.js // 素材上传
                |--- sendByGroup.js // 标签进行群发
                |--- tags.js // 用户管理-分组
                |--- user.js // 用户管理-用户信息
            |--- g  // Generator
            |--- tpl.js  // 消息模板
            |--- util.js  // 解析、格式化XML文件
            |--- wechat.js  // 处理与微信交互文件
        |--- app.js  // 入口文件
        |--- config.js  // 微信配置文件
        |--- package.json
        |--- README.md
        |--- weixin.js  // 回复文件
```
