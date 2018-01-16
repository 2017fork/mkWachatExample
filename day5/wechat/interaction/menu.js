const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        del: prefix + 'menu/delete?',
        current: prefix + 'get_current_selfmenu_info?' // 获取自定义菜单配置接口
    }
};

/*
* 创建菜单
* */
exports.createMenu = function (menu) {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.menu.create + '&access_token=' + data.access_token;
                request({
                    method: 'POST',
                    url: url,
                    body: menu,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Create Menu fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取菜单
* */
exports.getMenu = function () {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.menu.get + '&access_token=' + data.access_token;
                request({
                    url: url,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Get Menu fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 删除菜单
* */
exports.deleteMenu = function () {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.menu.del + '&access_token=' + data.access_token;
                request({
                    url: url,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Delete Menu fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取自定义菜单配置接口
* */
exports.currentMenu = function () {
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.menu.current + '&access_token=' + data.access_token;
                request({
                    url: url,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Ccurrent Menu fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};
