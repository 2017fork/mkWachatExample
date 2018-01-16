const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    AccessToken: prefix + 'token?grant_type=client_credential'
};

/*
* 拿到全局票据
* */
exports.fetchAccessToken = function (data) {
    // 检查是否有票据且是否过期
    if (this.access_token && this.expires_in){
        if (this.isValodAccesstoken(this)) {
            return Promise.resolve(this);
        }
    }
    return this.getAccessToken()
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
            this.saveAccessToken(data);

            return Promise.resolve(data);
        })
};

/*
* 检查 access_token 是否过期
* */
exports.isValodAccesstoken = (data) => {
    if(!data || !data.access_token || !data.expires_in) {
        return false;
    }
    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const now = (new Date().getTime());
    if(now < expires_in){ //  判断是否过期
        return true;
    } else {
        return false;
    }
};

/*
* 更新 access_token
* */
exports.updateAccesstoken = function() {
    const appID = this.appID;
    const appSecret = this.appSecret;
    const url = api.AccessToken + '&appid=' + appID + '&secret=' + appSecret;
    return new Promise((resolve, reject) => {
        request({ // 发起请求
            url: url,
            json: true
        }).then((response) => {
            const data = response.body;
            const now = (new Date().getTime());
            // 当前时间+票据返回的过期时间(7020s刷新) = 存起来的过期时间
            const expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;

            resolve(data)
        })
    });
};