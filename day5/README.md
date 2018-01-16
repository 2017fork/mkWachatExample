## node.js 开发微信公众号 --第天
### 各个消息接口的调用
> * 分组群发
> * 配置菜单。
> * 语义接口。
> * js sdk。
> * 语音搜索电影。

### 填坑!!!
> 微信分享部分规则有变！！！（分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致）
```js
获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
wx.onMenuShareTimeline({
    title: '', // 分享标题
    link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '', // 分享图标
    success: function () {
        // 用户确认分享后执行的回调函数
    },
    cancel: function () {
        // 用户取消分享后执行的回调函数
    }
});
```

## 目录结构
```js
|--- mkWachatExample
    |--- day5
        |--- config
            |--- wechat.text  // 保存access_token票据
            |--- wechat_ticket.text  // 保存ticket票据
        |--- libs
            |--- util.js  // 读写操作文件
        |--- wechat
            |--- interaction // 与微信互动功能
                |--- accessToken.js // 获取accessToken
                |--- material.js // 素材上传
                |--- menu.js // 菜单管理
                |--- semantic.js // 语义理解
                |--- sendByGroup.js // 标签进行群发
                |--- tags.js // 用户管理-分组
                |--- ticket.js // 管理ticket
                |--- user.js // 用户管理-用户信息
            |--- g  // Generator
            |--- tpl.js  // 消息模板
            |--- util.js  // 解析、格式化XML文件
            |--- wechat.js  // 处理与微信交互文件
        |--- wx // 微信互动
            |--- menu.js // 设置菜单项
            |--- reply.js // 回复文件
        |--- app.js  // 入口文件
        |--- config.js  // 微信配置文件
        |--- package.json
        |--- README.md
```