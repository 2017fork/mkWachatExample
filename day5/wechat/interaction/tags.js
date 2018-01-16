const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    group: {
        create: prefix + 'tags/create?',
        fetch: prefix + 'tags/get?',
        update: prefix + 'tags/update?',
        del: prefix + 'tags/delete?',
        batchtagging: prefix + 'tags/members/batchtagging?' // 为添加用户分组
    }
};
/*
* 创建分组
* */
exports.createGroup = function (name) { //标签名
    const form = {
        tag: {name: name}
    };
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.group.create + '&access_token=' + data.access_token;
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
                        throw new Error('create to group fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取分组
* */
exports.fetchGroup = function (tag) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.group.fetch + '&access_token=' + data.access_token;
                request({
                    url: url,
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
* 更新分组
* */
exports.updateGroup = function (tagId, name) {
    return new Promise((resolve, reject) => {
        const form = {
            tag: {
                id: tagId,
                name: name
            }
        };
        this.fetchAccessToken()
            .then((data) => {
                let url = api.group.update + '&access_token=' + data.access_token;
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
                        throw new Error('update to group fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 删除分组
* */
exports.deleteGroup = function (tagId) {
    return new Promise((resolve, reject) => {
        const form = {
            tag: {
                id: tagId
            }
        };
        this.fetchAccessToken()
            .then((data) => {
                let url = api.group.del + '&access_token=' + data.access_token;
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
                        throw new Error('update to group fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 批量把用户添加到分组
* */
exports.batchtagging = function (openid_lists, tagId) { // 粉丝列表、tagId
    return new Promise((resolve, reject) => {
        const form = {
            openid_list: openid_lists,
            tagid: tagId
        };
        this.fetchAccessToken()
            .then((data) => {
                let url = api.group.batchtagging + '&access_token=' + data.access_token;
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
                        throw new Error('batchtagging fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};