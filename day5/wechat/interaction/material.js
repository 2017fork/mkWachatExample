const fs = require('fs');
const _ = require('lodash');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    temporary: { // 临时素材
        upload: prefix + 'media/upload?',
        fetch: prefix + 'media/get?'
    },
    permanent: {// 永久素材
        upload: prefix + 'material/add_material?', // 其他类型永久素材
        uploadNews: prefix + 'material/add_news?', // 永久图文素材
        uploadNewsPic: prefix + 'media/uploadimg?', // 上传图文消息内的图片
        fetch: prefix + 'material/get_material?', // 获取素材
        del: prefix + 'material/del_material?',  // 删除素材
        update: prefix + 'material/update_news?',  // 更新素材
        count: prefix+ 'material/get_materialcount?',  // 获取素材总数
        batch: prefix+ 'material/batchget_material?'  // 获取素材列表
    }
};
/*
* 上传素材
* */
exports.uploadMaterial = function (type, material, permanent) { // 类型、素材、permanent
    /*
    * material 图文时传过来array, 否则为字符串路径
    * */

    let form = {};
    let uploadUrl = api.temporary.upload;
    /*
    * 判断永久素材或临时素材
    * */
    if (permanent) {
        uploadUrl = api.permanent.upload;
        _.extend(form, permanent) // form继承permanent对象
    }
    /*
    * 判断传过来的type类型
    * */
    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic;
    }
    if (type === 'news') {
        uploadUrl = api.permanent.uploadNews;
        form = material;
    } else {
        // 非图文时，为文件路径
        form.media = fs.createReadStream(material)
    }
    return new Promise((resolve, reject) => {
        /*
        * 拿到全局票据，构建请求
        * */
        this.fetchAccessToken()
            .then((data) => {
                let url = uploadUrl + '&access_token=' + data.access_token;
                if (!permanent) { // 微信开发文档上传永久素材有变， 有部分需要添加type
                    url += '&type=' + type;
                } else {
                    if(type !== 'pic' || type !== 'news'){
                        url += '&type=' + type;
                    }
                    form.access_token = data.access_token;
                }
                let options = {
                    method: 'POST',
                    url: url,
                    json: true
                };
                console.log('url', !permanent)
                if (type === 'news') {
                    options.body = form;
                } else {
                    options.formData = form;
                }
                console.log('options',options);
                request(options).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Upload material fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })

            });
    });
};

/*
* 下载素材
* */
exports.fetchMaterial = function (mediaId, type, permanent) { // 素材id、类型、permanent(永久或临时)
    let fetchUrl = api.temporary.fetch;
    /*
    * 判断永久素材或临时素材
    * */
    if (permanent) {
        fetchUrl = api.permanent.fetch;
    }
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = fetchUrl + '&access_token=' + data.access_token;
                let form = {};
                let options ={
                    method: 'POST',
                    url: url,
                    json: true
                };
                if (permanent) {
                    form.media_id = mediaId;
                    form.access_token = data.access_token;
                    options.body = form;
                } else {
                    if (type === 'video') {
                        url = url.replace('https://', 'http://')
                    }
                    url += '&media_id=' + mediaId
                }

                if (type === 'news' || type === 'video') {
                    request(options).then((response) => {
                        const _data = response.body;
                        if (_data) {
                            resolve(_data)
                        } else {
                            throw new Error('Fetch material fails')
                        }
                    }).catch((err) => {
                        resolve(err)
                    })
                } else {
                    resolve(url);
                }
            });
    });
};

/*
* 删除素材
* */
exports.deleteMaterial = function (mediaId) { // 素材id
    let form = {
        media_id: mediaId
    };
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.permanent.del + '&access_token=' + data.access_token + '&media_id=' + mediaId;
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
                        throw new Error('Delete material fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 更新素材总数
* */
exports.batchMaterial = function (options) { // 素材id
    options.type = options.type || 'image';
    options.offset = options.offset || 0;
    options.count = options.count || 1;
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.permanent.batch + '&access_token=' + data.access_token;
                request({
                    method: 'POST',
                    url: url,
                    body: options,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Batch material fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 更新素材列表
* */
exports.countMaterial = function () { // 素材id
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.permanent.count + '&access_token=' + data.access_token;
                request({
                    method: 'POST',
                    url: url,
                    json: true
                }).then((response) => {
                    const _data = response.body;
                    if (_data) {
                        resolve(_data)
                    } else {
                        throw new Error('Count material fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};

/*
* 获取素材
* */
exports.updateMaterial = function (mediaId, news) { // 素材id
    let form = {
        media_id: mediaId
    };
    _.extend(form, news);

    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then((data) => {
                let url = api.permanent.update + '&access_token=' + data.access_token + '&media_id=' + mediaId;
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
                        throw new Error('Delete material fails')
                    }
                }).catch((err) => {
                    resolve(err)
                })
            });
    });
};