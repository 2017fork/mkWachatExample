const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    AccessToken: prefix + 'token?grant_type=client_credential'
};
/*
* access_token读写
* */
function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken; // 获取access_token方法
    this.saveAccessToken = opts.saveAccessToken; // 保存access_token方法

    this.getAccessToken()
        .then((data) => {
            try {
                data = JSON.parse(data)
            }catch (e){
                return this.updateAccesstoken(); // access_token文件不存在或出错是去更新
            }

            // 判断是否在有效期内
            if (this.isValodAccesstoken(data)){
                return Promise.resolve(data);// 继续传递下去
            } else {
                return this.updateAccesstoken();
            }
        })
        .then((data) => { // 最终合法的data
            this.access_token = data.access_token;
            this.expires_in = data.expires_in;// 过期字段
            this.saveAccessToken(data)
        })
};
Wechat.prototype.isValodAccesstoken = (data) => {
    if(!data || !data.access_token || !data.expires_in) {
        return false;
    }
    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const now = (new Date().getDate());
    if(now < expires_in){ //  判断是否过期
        return true;
    } else {
        return false;
    }
};

Wechat.prototype.updateAccesstoken = function() {
    const appID = this.appID;
    const appSecret = this.appSecret;
    const url = api.AccessToken + '&appid=' + appID + '&secret=' + appSecret;
    return new Promise((resolve, reject) => {
        request({ // 发起请求
            url: url,
            json: true
        }).then((response) => {
            const data = response.body;
            const now = (new Date().getDate());
            // 当前时间+票据返回的过期时间(7020s刷新) = 存起来的过期时间
            const expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;

            resolve(data)
        })
    });
};
module.exports = Wechat;