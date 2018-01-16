const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    mass: {
        group: prefix + 'message/mass/sendall?', //  根据标签进行群发
        openID: prefix + 'message/mass/send?', //  根据OpenID列表进行群发
        del: prefix + 'message/mass/delete?', //  删除群发
        preview: prefix + 'message/mass/preview?'//  预览接口
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
    console.log('msg', msg) ;
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

/*
* 根据OpenID列表进行群发
* */
exports.sendByOpenID = function (type, message, openIds) { // 消息类型、消息内容、openId数组
    let msg = {
        msgtype: type,
        touser: openIds
    };
    msg[type] = message;

    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.mass.openID + '&access_token=' + data.access_token;
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
                        throw new Error('Send to OpenID fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 删除群发
* */
exports.deleteMass = function (msgId, article_idx) { // 发出的消息id、要删除的文章在图文消息中的位置，第一篇编号为1，该字段不填或填0会删除全部文章
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.mass.del + '&access_token=' + data.access_token;
                const form = {
                    "msg_id": msgId,
                    "article_idx": article_idx
                };
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
                        throw new Error('Delete mass fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 预览接口
* */
exports.previewMass = function (type, message, openId) { // 消息类型、消息内容、openId
    let msg = {
        msgtype: type,
        touser: openId
    };
    msg[type] = message;

    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.mass.openID + '&access_token=' + data.access_token;
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
                        throw new Error('Preview mass fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};