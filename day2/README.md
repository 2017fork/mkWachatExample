## node.js 开发微信公众号 --第二天
> 微信自动回复 （注意票据部分access_token）

### 注意事项
> * 微信公众号接口只支持80端口（线上暴露出去的接口不能带端口号）。
  * 微信接口配置信息的URL要是唯一能接收消息、事件的入口。
  * 调用微信接口使用https协议。
  * 用户向公众号发送消息时，会传过来OpenID(微信加密过，且每个用户对应的每个公众号的OpenID是唯一的)。
  * 最好先了解《进击Node.js基础（二》 Promise和Generator知识  https://www.imooc.com/learn/637

### access_token
> * 每两个小时过期需要重新获取（让系统每隔两个小时去刷新一次access_token，保证access_token时刻是可用的）。
  * 把access_token存在一个唯一的地方，方便频繁调用。

###
```js
|--- mkWachatExample
    |--- day2
        |--- config
            |--- wechat.text // 保存票据
        |--- libs
            |--- util.js // 读写操作文件
        |--- wechat
            |--- g // Generator
            |--- util.js // 解析、格式化XML文件
            |--- wechat.js // 处理微信交互文件
        |--- package.json
        |--- README.md
```