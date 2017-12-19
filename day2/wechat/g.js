/*
* Generator
* 中间件
* */
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const Wechat = require('./wechat');
const util = require('./util');

module.exports = (opts) => {

    const wechat = new Wechat(opts);
    return function* (next) { // 迭代器生成器
        /*
        *  验证逻辑(开发者身份)
        * */
        const token = opts.token;
        const signature = this.query.signature; // 签名
        const nonce = this.query.nonce;// 随机数
        const timestamp = this.query.timestamp;// 时间戳
        const echostr = this.query.echostr;
        // 字典排序
        const src = [token, timestamp, nonce].sort().join('');
        const sha = sha1(src);


        /*
        * --请求方法的判断--
        * get:微信服务器过来的请求
        * post:用户的事件(点击的消息或发送的消息)---需判断请求来源是否为微信，
        * */
        if (this.request.method === 'GET') {
            // 判断返回值是不是等于签名值(是否微信请求)
            if (sha === signature) {
                this.body = echostr + '';
            } else {
                this.body = 'wrong';
            }
        } else if (this.request.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong';
                return false;
            }
            // 获取post过来的数据，通过raw-body模块可以把http上的request对象,去拼装数据，拿到一二个buffer类型的XML数据
            let data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            });
            // 解析XML
            const content = yield util.parseXMLAsync(data);
            // 格式化
            const message = util.formatMessage(content.xml);

            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    const now = new Date().getDate();
                    this.status = 200;
                    this.type = 'application/xml';
                    const reply = '<xml> ' +
                        '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName> ' +
                        '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName> ' +
                        '<CreateTime>'+ now +'</CreateTime> ' +
                        '<MsgType><![CDATA[text]]></MsgType> ' +
                        '<Content><![CDATA[关注就对了]]></Content> ' +
                        '</xml>';
                    console.log(reply);
                    this.body = reply;

                    return;
                }
            }
        }

    }
};