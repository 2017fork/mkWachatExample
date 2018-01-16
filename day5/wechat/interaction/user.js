const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    user: {
        remark: prefix + 'user/info/updateremark?',
        fetch: prefix + 'user/info?',
        batchFetch: prefix + 'user/info/batchget?',
        list: prefix + 'user/get?'
    }
};
/*
* 设置用户备注名
* */
exports.remarkUser = function (openId, remark) {
    const form = {
        openid: openId,
        remark: remark
    };
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.user.remark + '&access_token=' + data.access_token;
                request({
                    method: 'POST',
                    url: url,
                    body: form,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Remark user fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取用户基本信息(UnionID机制)
* */
exports.fetchUser = function (openIds, lang) {
    lang = lang || 'zh_CN';
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let options = {
                    json: true
                }
                if (_.isArray(openIds)) {
                    options.url = api.user.batchFetch + '&access_token=' + data.access_token;
                    options.method = 'POST';
                    options.body = {
                        user_list: openIds
                    };
                } else {
                    options.url = api.user.fetch + '&access_token=' + data.access_token+ '&openid=' + openIds + '&lang=' + lang;
                }
                request(options).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Batch Fetch user fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取用户列表
* */
exports.listUser = function (openId) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.user.list + '&access_token=' + data.access_token;
                if (openId){
                    url += '&next_openid=' + openId;
                }
                request({
                    url: url,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('List user fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};