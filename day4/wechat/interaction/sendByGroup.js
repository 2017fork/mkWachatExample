const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    mass: {
        group: prefix + 'message/mass/sendall?' //  根据标签进行群发
    }
};
/*
* 根据标签进行群发
* */
exports.sendByGroup = function (type, message, tagId) { // 消息类型、消息内容
    let msg = {
        filter: {},
        msgtype: type
    };
    msg[type] = message;
    // 判断是否为群发
    if (!tagId) {
        msg.filter.is_to_all = true;
    } else {
        msg.filter.is_to_all = false;
        msg.filter = {
            is_to_all: false,
            tag_id : tagId
        }
    }
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.mass.group + '&access_token=' + data.access_token;
                request({
                    method: 'POST',
                    url: url,
                    body: msg,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Send to group fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};