## node.js 开发微信公众号 --第四天
### 各个消息接口的调用
> * 上传临时素材（图片、视频）。
  * 永久素材接口。
  * 用户分组。
  * 获取用户私密信息。
  * 地理位置和用户资料。

### 流程：
> ###### 接收到微信服务器的消息 --> 对消息解析 --> 根据解析制定回复的规则 --> 根据规则拿到的结果作为变量传递给xml模板。

### 填坑!!!
> 微信开发文档很多地方都有改变，请看好文档！！！请看好文档！！！请看好文档！！！ 如：新增其他类型永久素材需要添加type（请仔细看微信开发文档）
> #### 新增其他类型永久素材
> https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE  这个就需要TYPE

## 目录结构
```js
|--- mkWachatExample
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