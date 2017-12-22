/* ---验证公众号---
* 微信接口绑定域名配置：
*    1.将token、timestamp、nonce三个参数进行字典排序
*    2.把字典排序的结果进项sha1加密
*    3.将加密后的字符串与signature(签名)对比(相等则为微信请求，才能绑定)。原样返回就可以接入成功
* */

const Koa = require('koa');
const sha1 = require('sha1');

const config = {
    wechat: {
        appID: '',
        appSecret: '',
        token: '',
    }
};

const app = new Koa();
app.use(function* (next) { // 迭代器生成器
    /*
    *  验证逻辑(开发者身份)
    * */
    const token = config.wechat.token;
    const signature = this.query.signature; // 签名
    const nonce = this.query.nonce;// 随机数
    const timestamp = this.query.timestamp;// 时间戳
    const echostr = this.query.echostr;
    // 字典排序
    const src = [token, timestamp, nonce].sort().join('');
    const sha = sha1(src);

    // 判断返回值是不是等于签名值(是否微信请求)
    if (sha === signature) {
        this.body = echostr + '';
    } else {
        this.body = 'wrong';
    }

});

app.listen(1234);
console.log('yes: 1234');