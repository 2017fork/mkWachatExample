## node.js 开发微信公众号 --第一天
> 本地代理的搭建、入门加密认证


### 环境配置
   1. 微信测试账号： https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login
   2. 内外穿透：https://www.ngrok.cc （有免费的，就是比较慢）

#### 内外穿透：
  *  根据 https://www.ngrok.cc 下载对应的客户端，根据官网配置域名和端口已经运行。

     `需要注意： 本地端口如：127.0.0.1:1234，端口号为1234，要对应程序监听的端口app.listen(1234);`

#### 微信测试账号(接口配置信息)：
   * URL 设置为你在（内外穿透）设置的域名，或者也可以在运行ngrok的命令窗口上找到域名，
   * Token 随意设置


   > 如果接口配置信息提交失败，请查看ngrok是否启动且在线、app.listen(1234)端口和ngrok配置的本地端口是否一样、接口配置信息的URL和ngrok的域名是否一样。

### 目录结构介绍

```js
|--- mkWachatExample
    |--- day1 // 第一天
        |--- app.js // 入口文件
        |--- package.json
        |--- README.md
```