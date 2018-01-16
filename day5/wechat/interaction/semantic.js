// 语义理解
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/semantic/';
const api = {
    semantic: {
        create: prefix + 'semproxy/search?'
    }
};

/*
* 发送语义理解请求
* */
exports.semantic = function (semanticData) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                const url = api.semantic.create + '&access_token=' + data.access_token;
                semanticData.appid = data.appID;
                request({
                    method: 'POST',
                    url: url,
                    body: semanticData,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Semantic fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};