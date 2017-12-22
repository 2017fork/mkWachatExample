/* ---验证公众号---
* 微信接口绑定域名配置：
*    1.将token、timestamp、nonce三个参数进行字典排序
*    2.把字典排序的结果进项sha1加密
*    3.将加密后的字符串与signature(签名)对比(相等则为微信请求，才能绑定)。原样返回就可以接入成功
* */

const Koa = require('koa');
const path = require('path');
const wechat = require('./wechat/g');
const util = require('./libs/util');
const wechat_txt = path.join(__dirname, './config/wechat.txt');

const config = {
    wechat: {
        appID: '',
        appSecret: '',
        token: '',
        getAccessToken: () => {
            return util.readFileAsync(wechat_txt)
        },
        saveAccessToken: (data) => {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_txt, data)
        }

    }
};

const app = new Koa();
app.use(wechat(config.wechat));

app.listen(1234);
console.log('yes: 1234');